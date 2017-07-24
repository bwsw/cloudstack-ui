import { MdlPopoverComponent } from '@angular-mdl/popover';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MdDialog } from '@angular/material';
import { DiskOffering, Volume, Zone } from '../../shared/models';
import { DiskOfferingService, VolumeAttachmentData, ZoneService } from '../../shared/services';
import { VolumeResizeComponent } from '../../vm/vm-sidebar/volume-resize.component';
import { SpareDriveAttachmentComponent } from '../spare-drive-attachment/spare-drive-attachment.component';


@Component({
  selector: 'cs-spare-drive-item',
  templateUrl: 'spare-drive-item.component.html',
  styleUrls: ['spare-drive-item.component.scss']
})
export class SpareDriveItemComponent implements OnInit {
  @Input() public isSelected: boolean;
  @Input() public volume: Volume;
  @Output() public onClick = new EventEmitter();
  @Output() public onVolumeAttached = new EventEmitter<VolumeAttachmentData>();
  @Output() public onDelete = new EventEmitter();
  @Output() public onResize = new EventEmitter();
  @ViewChild(MdlPopoverComponent) public popoverComponent: MdlPopoverComponent;

  public diskOfferings: Array<DiskOffering>;

  constructor(
    private dialog: MdDialog,
    private diskOfferingService: DiskOfferingService,
    private zoneService: ZoneService
  ) {}

  public ngOnInit(): void {
    let zone;

    this.zoneService.get(this.volume.zoneId)
      .switchMap((_zone: Zone) => {
        zone = _zone;
        return this.diskOfferingService.getList({ zoneId: zone.id });
      })
      .subscribe(diskOfferings => {
        this.diskOfferings = diskOfferings.filter((diskOffering: DiskOffering) => {
          return this.diskOfferingService.isOfferingAvailableForVolume(diskOffering, this.volume, zone);
        });
      });
  }

  public attach(): void {
    this.dialog
      .open(SpareDriveAttachmentComponent, {
        data: {
          volume: this.volume,
          zoneId: this.volume.zoneId
        }
      })
      .afterClosed()
      .subscribe(virtualMachineId => {
        if (!virtualMachineId) {
          return;
        }
        this.onVolumeAttached.emit({
          id: this.volume.id,
          virtualMachineId
        });
      });
  }

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.popoverComponent.isVisible) {
      this.onClick.emit(this.volume);
    } else {
      this.popoverComponent.hide();
    }
  }

  public resize(): void {
    this.dialog.open(VolumeResizeComponent, {
      data: {
        volume: this.volume,
        diskOfferingList: this.diskOfferings
      }
    })
      .afterClosed()
      .subscribe(resizedVolume => {
        if (resizedVolume) {
          this.onVolumeResize(resizedVolume);
        }
      });
  }

  public remove(): void {
    this.onDelete.next(this.volume);
  }

  private onVolumeResize(volume: Volume): void {
    this.volume.size = volume.size;
    this.onResize.next(this.volume);
  }
}
