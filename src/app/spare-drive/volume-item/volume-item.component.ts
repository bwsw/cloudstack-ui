import { Component, Input, EventEmitter, Output, HostBinding } from '@angular/core';
import { Volume } from '../../shared/models/volume.model';
import { MdlDialogService } from 'angular2-mdl';
import { VolumeAttachmentComponent } from '../volume-attachment/volume-attachment.component';
import { VolumeAttachmentData } from '../../shared/services/volume.service';


@Component({
  selector: 'cs-volume-item',
  templateUrl: 'volume-item.component.html',
  styleUrls: ['volume-item.component.scss']
})
export class VolumeItemComponent {
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
      component: VolumeAttachmentComponent,
      classes: 'volume-attachment-dialog'
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
