import { Component } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';

import { Iso } from '../shared';


@Component({
  selector: 'cs-iso-attachment',
  templateUrl: 'iso-attachment.component.html',
  styleUrls: ['iso-attachment.component.scss', '../../shared/styles/iso-dialog.scss']
})
export class IsoAttachmentComponent {
  public selectedIso: Iso;
  public showIso = true;

  constructor(private dialog: MdlDialogReference) { }

  public onAttach(): void {
    this.dialog.hide(this.selectedIso);
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
