import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Iso } from '../shared';
import { TemplateFilters } from '../shared/base/template-filters';
import { IsoService } from '../shared/iso/iso.service';


@Component({
  selector: 'cs-iso-attachment',
  templateUrl: 'iso-attachment.component.html'
})
export class IsoAttachmentComponent {
  public selectedIso: Iso;
  private filters = [
    TemplateFilters.featured,
    TemplateFilters.self
  ];
  public zoneId: string;

  readonly isos$: Observable<Array<Iso>> = this.isoService.getGroupedTemplates(
    {},
    this.filters,
    true
  )
    .map(isos => isos.toArray());

  constructor(@Inject(MD_DIALOG_DATA) data, private isoService: IsoService) {
    this.zoneId = data.zoneId;
  }
}
