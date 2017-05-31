import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
  DiskOffering,
  DiskOfferingService,
  StatsUpdateService,
  Volume,
  VolumeTypes,
  Zone,
  ZoneService
} from '../../../../shared';

import { VolumeResizeComponent } from '../../volume-resize.component';

import { SnapshotCreationComponent } from './snapshot-creation/snapshot-creation.component';
import { SnapshotActionsService } from './snapshot/snapshot-actions.service';
import { SnapshotModalComponent } from './snapshot/snapshot-modal.component';
import { DialogService } from '../../../../dialog/dialog-module/dialog.service';


const numberOfShownSnapshots = 5;

@Component({
  selector: 'cs-volume',
  templateUrl: 'volume.component.html',
  styleUrls: ['volume.component.scss'],
})
export class VolumeComponent implements OnInit {
  @Input() public volume: Volume;
  @Output() public onDetach = new EventEmitter();
  @Output() public onResize = new EventEmitter();

  public expandStorage: boolean;
  private _loading = false;

  constructor(
    private dialogService: DialogService,
    private diskOfferingService: DiskOfferingService,
    private statsUpdateService: StatsUpdateService,
    private zoneService: ZoneService,
    public snapshotActionsService: SnapshotActionsService) {
  }

  public get loading(): Boolean {
    return this._loading || this.volume['loading'];
  }

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
    this.getOfferings().switchMap(diskOfferingList => {
      this._loading = false;
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
      .subscribe(resizedVolume => {
        if (resizedVolume) {
          this.onVolumeResize(resizedVolume);
        }
      });
  }

  public takeSnapshot(volume: Volume): void {
    this.dialogService.showCustomDialog({
      component: SnapshotCreationComponent,
      classes: 'snapshot-creation-dialog',
      providers: [{ provide: 'volume', useValue: volume }],
    });
  }

  private onVolumeResize(volume: Volume): void {
    this.volume.size = volume.size;
    this.onResize.next(this.volume);
    this.statsUpdateService.next();
  }

  private getOfferings(): Observable<Array<DiskOffering>> {
    let zone;

    return this.zoneService.get(this.volume.zoneId)
      .switchMap((_zone: Zone) => {
        zone = _zone;
        return this.diskOfferingService.getList({ zoneId: zone.id });
      })
      .map(diskOfferings => {
        return diskOfferings.filter((diskOffering: DiskOffering) => {
          return this.diskOfferingService.isOfferingAvailableForVolume(diskOffering, this.volume, zone);
        });
      });
  }
}
