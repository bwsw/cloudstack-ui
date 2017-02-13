import { Component, OnInit } from '@angular/core';
import { TemplatePageComponent } from '../template-page/template-page.component';
import { Iso } from '../shared/iso.model';
import { MdlDialogReference, MdlDialogService } from 'angular2-mdl';


@Component({
  selector: 'cs-iso-attachment',
  templateUrl: 'iso-attachment.component.html',
  styleUrls: ['iso-attachment.component.scss']
})
export class IsoAttachmentComponent extends TemplatePageComponent implements OnInit {
  public selectedIso: Iso;

  constructor(private dialog: MdlDialogReference) {
    super();
  }

  public selectIso(iso: Iso): void {
    this.selectedIso = iso;
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
