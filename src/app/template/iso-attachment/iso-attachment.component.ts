import { Component } from '@angular/core';
import { TemplateListComponent } from '../template-list/template-list.component';
import { Iso } from '../shared/iso.model';
import { MdlDialogReference } from 'angular2-mdl';


@Component({
  selector: 'cs-iso-attachment',
  templateUrl: 'iso-attachment.component.html',
  styleUrls: ['iso-attachment.component.scss']
})
export class IsoAttachmentComponent extends TemplateListComponent {
  public selectedIso: Iso;

  constructor(
    public dialog: MdlDialogReference,
  ) {
    super();
  }
}
