import { Component, Input, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { MdlPopoverComponent } from '@angular-mdl/popover';

import { SpareDriveAttachmentComponent } from '../spare-drive-attachment/spare-drive-attachment.component';
import { VolumeResizeComponent } from '../../vm/vm-sidebar/volume-resize.component';
import {
  DiskOfferingService,
  VolumeAttachmentData,
  ZoneService
} from '../../shared/services';
import { DiskOffering, Volume, Zone } from '../../shared/models';
import { DialogService } from '../../dialog/dialog-module/dialog.service';


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
    private dialogService: DialogService,
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
    this.dialogService.showCustomDialog({
      component: SpareDriveAttachmentComponent,
      providers: [
        { provide: 'volume', useValue: this.volume },
        { provide: 'zoneId', useValue: this.volume.zoneId }
      ],
      classes: 'spare-drive-attachment-dialog'
    })
      .switchMap(res => res.onHide())
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
    this.dialogService.showCustomDialog({
      component: VolumeResizeComponent,
      classes: 'volume-resize-dialog',
      providers: [
        { provide: 'volume', useValue: this.volume },
        { provide: 'diskOfferingList', useValue: this.diskOfferings }
      ],
    })
      .switchMap(res => res.onHide())
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
