import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MdDialog } from '@angular/material';

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
import { RecurringSnapshotsComponent } from '../../../../snapshot/recurring-snapshots/recurring-snapshots.component';


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
    private dialog: MdDialog,
    private diskOfferingService: DiskOfferingService,
    private statsUpdateService: StatsUpdateService,
    private zoneService: ZoneService
  ) {}

  public get loading(): boolean {
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

  public showVolumeResizeDialog(): void {
    this.getOfferings().switchMap(diskOfferingList => {
      this._loading = false;
      return this.dialog.open(VolumeResizeComponent, {
         panelClass: 'volume-resize-dialog',
         data: { volume: this.volume, diskOfferingList: diskOfferingList }
      }).afterClosed();
    }).subscribe(resizedVolume => {
       if (resizedVolume) {
         this.onVolumeResize(resizedVolume);
       }
     });
  }

  public showRecurringSnapshotsDialog(): void {
    this.dialog.open(RecurringSnapshotsComponent, {
      data: this.volume
    });
  }

  public takeSnapshot(volume: Volume): void {
    this.dialog.open(SnapshotCreationComponent, {
      data: volume
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
        return this.diskOfferingService.getList({ zoneId: zone.id });
      })
      .map(diskOfferings => {
        return diskOfferings.filter((diskOffering: DiskOffering) => {
          return this.diskOfferingService.isOfferingAvailableForVolume(diskOffering, this.volume, zone);
        });
      });
  }
}
