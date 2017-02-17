import { Component } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';

import { TemplateFilterListComponent } from '../template-filter-list/template-filter-list.component';
import { Iso } from '../shared';


@Component({
  selector: 'cs-iso-attachment',
  templateUrl: 'iso-attachment.component.html',
  styleUrls: ['iso-attachment.component.scss']
})
export class IsoAttachmentComponent extends TemplateFilterListComponent {
  public selectedIso: Iso;
  public showIso = true;

  constructor(private dialog: MdlDialogReference) {
    super();
  }

  public onAttach(): void {
    this.dialog.hide(this.selectedIso);
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
