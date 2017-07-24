import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

import { Iso } from '../shared';


@Component({
  selector: 'cs-iso-attachment',
  templateUrl: 'iso-attachment.component.html',
  styleUrls: ['iso-attachment.component.scss', '../../shared/styles/iso-dialog.scss']
})
export class IsoAttachmentComponent {
  public selectedIso: Iso;
  public showIso = true;

  constructor(
    @Inject(MD_DIALOG_DATA) public zoneId: string,
    private dialogRef: MdDialogRef<IsoAttachmentComponent>
  ) { }

  public onAttach(): void {
    this.dialogRef.close(this.selectedIso);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
