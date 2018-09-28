import { Component } from '@angular/core';
import { Iso } from '../shared';

@Component({
  selector: 'cs-iso-attachment',
  templateUrl: 'iso-attachment.component.html',
})
export class IsoAttachmentComponent {
  public selectedIso: Iso;
}
