import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import {
  DialogService,
  DiskOffering,
  DiskOfferingService,
  JobsNotificationService,
  StatsUpdateService,
  Volume,
  VolumeResizeData,
  VolumeTypes,
  Zone,
  ZoneService
} from '../../../../shared';

import { VolumeResizeComponent } from '../../volume-resize.component';

import { SnapshotCreationComponent } from './snapshot-creation/snapshot-creation.component';
import { SnapshotActionsService } from './snapshot/snapshot-actions.service';
import { SnapshotModalComponent } from './snapshot/snapshot-modal.component';
import { VolumeService } from '../../../../shared/services/volume.service';


const numberOfShownSnapshots = 5;

@Component({
  selector: 'cs-volume',
  templateUrl: 'volume.component.html',
  styleUrls: ['volume.component.scss'],
})
export class VolumeComponent implements OnInit {
  @Input() public volume: Volume;
  @Output() public onDetach = new EventEmitter();

  public expandStorage: boolean;
  public loading = false;

  constructor(
    private dialogService: DialogService,
    private diskOfferingService: DiskOfferingService,
    private jobNotificationService: JobsNotificationService,
    private statsUpdateService: StatsUpdateService,
    private volumeService: VolumeService,
    private translateService: TranslateService,
    private zoneService: ZoneService,
    public snapshotActionsService: SnapshotActionsService
  ) { }

  public ngOnInit(): void {
    this.expandStorage = false;
  }

  public get showVolumeActions(): boolean {
    if (!this.volume) {
      return false;
    }

    return this.showAttachmentActions || this.showSnapshotCollapseButton;
  }

  public get showAttachmentActions(): boolean {
    return this.volume.type === VolumeTypes.DATADISK;
  }

  public get showSnapshotCollapseButton(): boolean {
    return this.volume.snapshots.length > numberOfShownSnapshots;
  }

  public showSnapshots(): void {
    this.dialogService.showCustomDialog({
      component: SnapshotModalComponent,
      providers: [{ provide: 'volume', useValue: this.volume }],
      styles: { width: '700px' }
    });
  }

  public toggleStorage(): void {
    this.expandStorage = !this.expandStorage;
  }

  public detach(): void {
    this.onDetach.emit(this.volume);
  }

  public showVolumeResizeDialog(volume: Volume): void {
    let notificationId: string;
    this.loading = true;

    this.getOfferings().switchMap(diskOfferingList => {
      this.loading = false;
      return this.dialogService.showCustomDialog({
        component: VolumeResizeComponent,
        classes: 'volume-resize-dialog',
        providers: [
          { provide: 'volume', useValue: volume },
          { provide: 'diskOfferingList', useValue: diskOfferingList }
        ]
      });
    })
      .switchMap(res => res.onHide())
      .switchMap((volumeResizeData: VolumeResizeData) => {
        if (volumeResizeData) {
          notificationId = this.jobNotificationService.add('VOLUME_RESIZING');
          return this.volumeService.resize(volumeResizeData);
        }
        return Observable.of(null);
      })
      .subscribe(
        (newVolume: Volume) => {
          if (!newVolume) {
            return;
          }
          volume.size = newVolume.size;

          this.jobNotificationService.finish({
            id: notificationId,
            message: 'VOLUME_RESIZED'
          });

          this.statsUpdateService.next();
        },
        error => {
          this.jobNotificationService.fail({
            id: notificationId,
            message: 'VOLUME_RESIZE_FAILED'
          });
          this.translateService.get(error.message)
            .subscribe(str => this.dialogService.alert(str));
        }
      );
  }

  public takeSnapshot(volumeId: string): void {
    this.dialogService.showCustomDialog({
      component: SnapshotCreationComponent,
      classes: 'snapshot-creation-dialog',
      providers: [{ provide: 'volumeId', useValue: volumeId }],
    });
  }

  private getOfferings(): Observable<Array<DiskOffering>> {
    let zone;

    return this.zoneService.get(this.volume.zoneId)
      .switchMap((_zone: Zone) => {
        zone = _zone;
        return this.diskOfferingService.getList(zone.id);
      })
      .map(diskOfferings => {
        return diskOfferings.filter((diskOffering: DiskOffering) => {
          return this.diskOfferingService.isOfferingAvailableForVolume(diskOffering, this.volume, zone);
        });
      });
  }
}
