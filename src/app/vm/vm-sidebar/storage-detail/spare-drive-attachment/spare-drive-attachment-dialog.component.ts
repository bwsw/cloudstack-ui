import { Component, Inject } from '@angular/core';
import { Volume } from '../../../../shared/models';
import { MdlDialogReference } from 'angular2-mdl';

@Component({
  selector: 'cs-spare-drive-attachment-dialog',
  templateUrl: 'spare-drive-attachment-dialog.component.html'
})
export class SpareDriveAttachmentDialogComponent {
  public selectedVolume: Volume;

  constructor(
    public dialog: MdlDialogReference,
    @Inject('volumes') public volumes: Array<Volume>
  ) {}

  public onAttach(volume: Volume): void {
    this.dialog.hide(volume);
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
