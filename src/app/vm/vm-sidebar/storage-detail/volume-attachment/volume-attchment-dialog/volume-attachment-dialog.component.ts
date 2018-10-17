import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Volume } from '../../../../../shared/models';

@Component({
  selector: 'cs-volume-attachment-dialog',
  templateUrl: 'volume-attachment-dialog.component.html',
  styleUrls: ['volume-attachment-dialog.component.scss'],
})
export class VolumeAttachmentDialogComponent implements OnInit {
  public selectedVolume: Volume;

  constructor(@Inject(MAT_DIALOG_DATA) public volumes: Volume[]) {}

  public ngOnInit(): void {
    if (this.volumes.length) {
      this.selectedVolume = this.volumes[0];
    }
  }
}
