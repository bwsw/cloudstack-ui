import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { Volume } from '../../../../../shared/models';

@Component({
  selector: 'cs-spare-drive-attachment-dialog',
  templateUrl: 'spare-drive-attachment-dialog.component.html',
  styleUrls: ['spare-drive-attachment-dialog.component.scss']
})
export class SpareDriveAttachmentDialogComponent implements OnInit {
  public selectedVolume: Volume;

  constructor(@Inject(MD_DIALOG_DATA) public volumes: Array<Volume>) {}

  public ngOnInit(): void {
    if (this.volumes.length) {
      this.selectedVolume = this.volumes[0];
    }
  }
}
