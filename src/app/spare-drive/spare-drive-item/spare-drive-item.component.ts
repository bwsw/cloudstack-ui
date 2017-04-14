import { Component, Input, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';
import { MdlPopoverComponent } from '@angular2-mdl-ext/popover';

import { SpareDriveAttachmentComponent } from '../spare-drive-attachment/spare-drive-attachment.component';
import { VolumeResizeComponent } from '../../vm/vm-sidebar/volume-resize.component';
import {
  DiskOfferingService,
  VolumeAttachmentData,
  VolumeResizeData,
  VolumeService,
  ZoneService
} from '../../shared/services';
import { DiskOffering, Volume, Zone } from '../../shared/models';


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
    private dialogService: MdlDialogService,
    private diskOfferingService: DiskOfferingService,
    private translateService: TranslateService,
    private volumeService: VolumeService,
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
          return this.diskOfferingService.isOfferingAvailableForVolume(diskOffering, this.volume, zone);
        });
      });
  }

  public attach(): void {
    this.dialogService.showCustomDialog({
      component: SpareDriveAttachmentComponent,
      providers: [{ provide: 'zoneId', useValue: this.volume.zoneId }],
      classes: 'spare-drive-attachment-dialog'
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
        { provide: 'diskOfferingList', useValue: this.diskOfferings }
      ],
    })
      .switchMap(res => res.onHide())
      .subscribe((volumeResizeData: VolumeResizeData) => {
        if (volumeResizeData) {
          this._resize(volumeResizeData);
        }
      });
  }

  public remove(): void {
    this.onDelete.next(this.volume);
  }

  private _resize(data: VolumeResizeData): void {
    this.volumeService.resize(data)
      .subscribe(
        (newVolume: Volume) => {
          this.diskOfferingService.get(data.diskOfferingId)
            .subscribe(diskOffering => {
              this.volume = newVolume;
              this.volume.diskOffering = diskOffering;
              this.onResize.emit(this.volume);
            });
        },
        error => {
          this.translateService.get(error.message)
            .subscribe(str => this.dialogService.alert(str));
        }
      );
  }
}
