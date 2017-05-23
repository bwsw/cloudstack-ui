import { Component, Inject } from '@angular/core';

import { Iso } from '../shared';
import { MdlDialogReference } from '../../shared/services/dialog';


@Component({
  selector: 'cs-iso-attachment',
  templateUrl: 'iso-attachment.component.html',
  styleUrls: ['iso-attachment.component.scss', '../../shared/styles/iso-dialog.scss']
})
export class IsoAttachmentComponent {
  public selectedIso: Iso;
  public showIso = true;

  constructor(
    @Inject('zoneId') public zoneId: string,
    private dialog: MdlDialogReference
  ) { }

  public onAttach(): void {
    this.dialog.hide(this.selectedIso);
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
