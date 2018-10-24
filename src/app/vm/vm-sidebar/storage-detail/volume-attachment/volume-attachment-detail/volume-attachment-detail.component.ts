import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Volume } from '../../../../../shared/models';
import { VolumeAttachmentDialogComponent } from '../volume-attchment-dialog/volume-attachment-dialog.component';

@Component({
  selector: 'cs-volume-attachment-detail',
  templateUrl: 'volume-attachment-detail.component.html',
  styleUrls: ['volume-attachment-detail.component.scss'],
})
export class VolumeAttachmentDetailComponent {
  @Input()
  public volumes: Volume[];
  @Output()
  public attached = new EventEmitter<Volume>();

  public selectedVolume: Volume;

  constructor(private dialog: MatDialog) {}

  public showDialog(): void {
    this.dialog
      .open(VolumeAttachmentDialogComponent, {
        width: '375px',
        data: this.volumes,
      })
      .afterClosed()
      .subscribe((volume: Volume) => (this.selectedVolume = volume));
  }

  public attachVolume(): void {
    this.attached.emit(this.selectedVolume);
    this.selectedVolume = null;
  }
}
