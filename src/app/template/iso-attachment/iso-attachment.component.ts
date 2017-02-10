import { Component, OnInit } from '@angular/core';
import { TemplateListComponent } from '../template-list/template-list.component';
import { Iso } from '../shared/iso.model';
import { MdlDialogReference } from 'angular2-mdl';


@Component({
  selector: 'cs-iso-attachment',
  templateUrl: 'iso-attachment.component.html',
  styleUrls: ['iso-attachment.component.scss']
})
export class IsoAttachmentComponent extends TemplateListComponent implements OnInit {
  public selectedIso: Iso;

  constructor(public dialog: MdlDialogReference) {
    super();
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.showIso = true;
  }

  public onAttach(): void {
    this.dialog.hide(this.selectedIso);
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
