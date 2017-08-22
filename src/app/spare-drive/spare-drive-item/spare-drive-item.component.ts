import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MdMenuTrigger, MdDialog } from '@angular/material';
import { DiskOffering, Volume, Zone } from '../../shared/models';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { VolumeAttachmentData } from '../../shared/services/volume.service';
import { ZoneService } from '../../shared/services/zone.service';
import { VolumeResizeComponent } from '../../vm/vm-sidebar/volume-resize/volume-resize.component';
import { SpareDriveAttachmentComponent } from '../spare-drive-attachment/spare-drive-attachment.component';


@Component({
  selector: 'cs-spare-drive-item',
  templateUrl: 'spare-drive-item.component.html',
  styleUrls: ['spare-drive-item.component.scss']
})
export class SpareDriveItemComponent implements OnInit {
  @Input() public isSelected: (volume) => boolean;
  @Input() public item: Volume;
  @Output() public onClick = new EventEmitter();
  @Output() public onVolumeAttached = new EventEmitter<VolumeAttachmentData>();
  @Output() public onDelete = new EventEmitter();
  @Output() public onResize = new EventEmitter();
  @ViewChild(MdMenuTrigger) public mdMenuTrigger: MdMenuTrigger;

  public diskOfferings: Array<DiskOffering>;

  constructor(
    private dialog: MdDialog,
    private diskOfferingService: DiskOfferingService,
    private zoneService: ZoneService
  ) {}

  public ngOnInit(): void {
    let zone;

    this.zoneService
      .get(this.item.zoneId)
      .switchMap((_zone: Zone) => {
        zone = _zone;
        return this.diskOfferingService.getList({ zoneId: zone.id });
      })
      .subscribe(diskOfferings => {
        this.diskOfferings = diskOfferings.filter((diskOffering: DiskOffering) => {
          return this.diskOfferingService.isOfferingAvailableForVolume(
            diskOffering,
            this.item,
            zone
          );
        });
      });
  }

  public get stateTranslationToken(): string {
    const stateTranslations = {
      'ALLOCATED': 'SPARE_DRIVE_STATE.ALLOCATED',
      'READY': 'SPARE_DRIVE_STATE.READY'
    };

    return stateTranslations[this.item.state.toUpperCase()];
  }

  public attach(): void {
    this.dialog
     .open(SpareDriveAttachmentComponent, {
       data: {
         volume: this.item,
         zoneId: this.item.zoneId
       },
       panelClass: 'spare-drive-attachment-dialog'
     }).afterClosed()
      .subscribe(virtualMachineId => {
        if (!virtualMachineId) {
          return;
        }
        this.onVolumeAttached.emit({
          id: this.item.id,
          virtualMachineId
        });
      });
  }

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.mdMenuTrigger.menuOpen) {
      this.onClick.emit(this.item);
    }
  }

  public resize(): void {
    this.dialog.open(VolumeResizeComponent, {
       data: {
         volume: this.item,
         diskOfferingList: this.diskOfferings
       },
      panelClass: 'volume-resize-dialog'
    }).afterClosed()
      .subscribe(resizedVolume => {
        if (resizedVolume) {
          this.onVolumeResize(resizedVolume);
        }
      });
  }

  public remove(): void {
    this.onDelete.next(this.item);
  }

  private onVolumeResize(volume: Volume): void {
    this.item.size = volume.size;
    this.onResize.next(this.item);
  }
}
