import { Component, OnInit } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';

import { Iso } from '../shared';
import { TemplatePageComponent } from '../template-page/template-page.component';


@Component({
  selector: 'cs-iso-attachment',
  templateUrl: 'iso-attachment.component.html',
  styleUrls: ['iso-attachment.component.scss']
})
export class IsoAttachmentComponent extends TemplatePageComponent implements OnInit {
  public selectedIso: Iso;
  public visibleTemplateList: Array<Iso> = [];

  constructor(private dialog: MdlDialogReference) {
    super();
  }

  public selectIso(iso: Iso): void {
    this.selectedIso = iso;
  }

  public ngOnInit(): void {
    this.updateDisplayMode('iso');
  }

  public onAttach(): void {
    this.dialog.hide(this.selectedIso);
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
