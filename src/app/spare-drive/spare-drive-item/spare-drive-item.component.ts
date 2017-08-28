import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MdMenuTrigger } from '@angular/material';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
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
    private dialogService: DialogService,
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
    this.dialogService.showCustomDialog({
      component: SpareDriveAttachmentComponent,
      providers: [
        { provide: 'volume', useValue: this.item },
        { provide: 'zoneId', useValue: this.item.zoneId }
      ],
      classes: 'spare-drive-attachment-dialog'
    })
      .switchMap(res => res.onHide())
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
    this.dialogService.showCustomDialog({
      component: VolumeResizeComponent,
      classes: 'volume-resize-dialog',
      providers: [
        { provide: 'volume', useValue: this.item },
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
    this.onDelete.next(this.item);
  }

  private onVolumeResize(volume: Volume): void {
    this.item.size = volume.size;
    this.onResize.next(this.item);
  }
}
