import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { Iso } from '../shared';

@Component({
  selector: 'cs-iso-attachment',
  templateUrl: 'iso-attachment.component.html'
})
export class IsoAttachmentComponent {
  public selectedIso: Iso;
  public zoneId: string;

  constructor(@Inject(MAT_DIALOG_DATA) data) {
    this.zoneId = data.zoneId;
  }
}
