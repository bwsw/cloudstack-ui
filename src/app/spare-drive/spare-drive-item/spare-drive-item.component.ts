import { Component, Input, EventEmitter, Output, HostBinding } from '@angular/core';
import { Volume } from '../../shared/models/volume.model';
import { MdlDialogService } from 'angular2-mdl';
import { SpareDriveAttachmentComponent } from '../spare-drive-attachment/spare-drive-attachment.component';
import { VolumeAttachmentData } from '../../shared/services/volume.service';
import { VolumeResizeComponent } from '../../vm/vm-sidebar/volume-resize.component';


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

  @HostBinding('class.grid') public grid = true;

  constructor(private dialogService: MdlDialogService) {}

  public handleClick(): void {
    this.onClick.emit(this.volume);
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

  public resize(): void {
    this.dialogService.showCustomDialog({
      component: VolumeResizeComponent,
      classes: 'volume-resize-dialog',
      providers: [{ provide: 'volume', useValue: this.volume }]
    })
      .switchMap(res => res.onHide())
      .subscribe((newSize: any) => {
        if (newSize != null) {
          const data = {
            id: this.volume.id,
            size: newSize
          };
          this.onResize.next(data);
        }
      });
  }

  public remove(): void {
    this.onDelete.next(this.volume);
  }
}
