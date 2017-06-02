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

import { SnapshotCreationComponent } from './snapshot-creation/snapshot-creation.component';
import { VolumeResizeComponent } from '../../volume-resize.component';
import { DialogService } from '../../../../dialog/dialog-module/dialog.service';


@Component({
  selector: 'cs-volume',
  templateUrl: 'volume.component.html',
  styleUrls: ['volume.component.scss'],
})
export class VolumeComponent implements OnInit {
  @Input() public volume: Volume;
  @Output() public onDetach = new EventEmitter();
  @Output() public onResize = new EventEmitter();

  public expandDetails: boolean;
  private _loading = false;

  constructor(
    private dialogService: DialogService,
    private diskOfferingService: DiskOfferingService,
    private statsUpdateService: StatsUpdateService,
    private zoneService: ZoneService
  ) {}

  public get loading(): Boolean {
    return this._loading || this.volume['loading'];
  }

  public ngOnInit(): void {
    this.expandDetails = false;
  }

  public get showAttachmentActions(): boolean {
    return this.volume.type === VolumeTypes.DATADISK;
  }

  public toggleDetails(): void {
    this.expandDetails = !this.expandDetails;
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
    this.volume = volume;
    this.onResize.next(this.volume);
    this.statsUpdateService.next();
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
