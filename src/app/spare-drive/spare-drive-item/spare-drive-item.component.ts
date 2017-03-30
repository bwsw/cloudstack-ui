import { Component, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { Volume } from '../../shared/models/volume.model';
import { MdlDialogService } from 'angular2-mdl';
import { SpareDriveAttachmentComponent } from '../spare-drive-attachment/spare-drive-attachment.component';
import { VolumeAttachmentData } from '../../shared/services/volume.service';
import { VolumeResizeComponent, VolumeResizeData } from '../../vm/vm-sidebar/volume-resize.component';
import { MdlPopoverComponent } from '@angular2-mdl-ext/popover';
import { DiskOffering } from '../../shared/models/disk-offering.model';
import { DiskOfferingService } from '../../shared/services/disk-offering.service';
import { ZoneService } from '../../shared/services/zone.service';
import { Zone } from '../../shared/models/zone.model';


@Component({
  selector: 'cs-spare-drive-item',
  templateUrl: 'spare-drive-item.component.html',
  styleUrls: ['spare-drive-item.component.scss']
})
export class SpareDriveItemComponent {
  @Input() public isSelected: boolean;
  @Input() public volume: Volume;
  @Output() public onClick = new EventEmitter();
  @Output() public onVolumeAttached = new EventEmitter<VolumeAttachmentData>();
  @Output() public onDelete = new EventEmitter();
  @Output() public onResize = new EventEmitter();
  @ViewChild(MdlPopoverComponent) public popoverComponent: MdlPopoverComponent;

  public diskOfferings: Array<DiskOffering>;

  constructor(
    private dialogService: MdlDialogService,
    private diskOfferingService: DiskOfferingService,
    private zoneService: ZoneService
  ) {}

  public ngOnInit(): void {
    let zone;

    this.zoneService.get(this.volume.zoneId)
      .switchMap((_zone: Zone) => {
        zone = _zone;
        return this.diskOfferingService.getList(zone.id);
      })
      .subscribe(diskOfferings => {
        this.diskOfferings = diskOfferings.filter((diskOffering: DiskOffering) => {
          return diskOffering.isCustomized ||
            diskOffering.isLocal === zone.localStorageEnabled && diskOffering.id !== this.volume.diskOfferingId;
        })
      });
}

public attach(): void {
  this.dialogService.showCustomDialog({
  component: SpareDriveAttachmentComponent,
  classes: 'spare-drive-attachment-dialog',
  providers: [{ provide: 'zoneId', useValue: this.volume.zoneId }]
})
  .switchMap(res => res.onHide())
  .subscribe((data: string) => {
    if (!data) {
      return;
    }
    this.onVolumeAttached.emit({
      id: this.volume.id,
      virtualMachineId: data
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
    { provide: 'diskOfferings', useValue: this.diskOfferings }
  ],
})
  .switchMap(res => res.onHide())
  .subscribe((volumeResizeData: VolumeResizeData) => {
    if (volumeResizeData) {
      this.onResize.next(volumeResizeData);
    }
  });
}

public remove(): void {
  this.onDelete.next(this.volume);
}
}
