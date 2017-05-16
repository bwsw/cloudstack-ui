import { Component, Inject, OnInit } from '@angular/core';
import { Volume } from '../../../../../shared/models';
import { MdlDialogReference } from 'angular2-mdl';

@Component({
  selector: 'cs-spare-drive-attachment-dialog',
  templateUrl: 'spare-drive-attachment-dialog.component.html',
  styleUrls: ['spare-drive-attachment-dialog.component.scss']
})
export class SpareDriveAttachmentDialogComponent implements OnInit {
  public selectedVolume: Volume;

  constructor(
    public dialog: MdlDialogReference,
    @Inject('volumes') public volumes: Array<Volume>
  ) {}

  public ngOnInit(): void {
    if (this.volumes.length) {
      this.selectedVolume = this.volumes[0];
    }
  }

  public onAttach(): void {
    this.dialog.hide(this.selectedVolume);
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
