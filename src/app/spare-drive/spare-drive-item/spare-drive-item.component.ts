import { Component, Input, EventEmitter, Output, HostBinding } from '@angular/core';
import { Volume } from '../../shared/models/volume.model';
import { MdlDialogService } from 'angular2-mdl';
import { SpareDriveAttachmentComponent } from '../spare-drive-attachment/spare-drive-attachment.component';
import { VolumeAttachmentData } from '../../shared/services/volume.service';


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

  public resize(): void {}

  public remove(): void {
    this.onDelete.next(this.volume);
  }
}
