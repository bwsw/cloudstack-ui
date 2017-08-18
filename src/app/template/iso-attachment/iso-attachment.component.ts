import { Component, Inject } from '@angular/core';

import { Iso } from '../shared';
import { IsoService } from '../shared/iso.service';
import { TemplateFilters } from '../shared/base-template.service';
import { Observable } from 'rxjs/Observable';
import { MdlDialogReference } from '../../dialog/dialog-module';


@Component({
  selector: 'cs-iso-attachment',
  templateUrl: 'iso-attachment.component.html',
  styleUrls: ['iso-attachment.component.scss', '../../shared/styles/iso-dialog.scss']
})
export class IsoAttachmentComponent {
  public selectedIso: Iso;
  private filters = [
    TemplateFilters.featured,
    TemplateFilters.self
  ];

  readonly isos$: Observable<Array<Iso>> = this.isoService.getGroupedTemplates<Iso>(
    {},
    this.filters,
    true
  )
    .map(isos => isos.toArray());

  constructor(
    @Inject('zoneId') public zoneId: string,
    private dialog: MdlDialogReference,
    private isoService: IsoService
  ) {}


  public onAttach(): void {
    this.dialog.hide(this.selectedIso);
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
