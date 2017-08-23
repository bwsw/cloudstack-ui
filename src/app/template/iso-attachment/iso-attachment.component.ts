import { Component, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { Iso } from '../shared';
import { IsoService } from '../shared/iso.service';
import { TemplateFilters } from '../shared/base-template.service';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'cs-iso-attachment',
  templateUrl: 'iso-attachment.component.html',
  styleUrls: ['../../shared/styles/iso-dialog.scss']
})
export class IsoAttachmentComponent {
  public selectedIso: Iso;
  private filters = [
    TemplateFilters.featured,
    TemplateFilters.self
  ];
  public zoneId: string;

  readonly isos$: Observable<Array<Iso>> = this.isoService.getGroupedTemplates<Iso>(
    {},
    this.filters,
    true
  )
    .map(isos => isos.toArray());

  constructor(
    @Inject(MD_DIALOG_DATA) data,
    private dialogRef: MdDialogRef<IsoAttachmentComponent>,
    private isoService: IsoService
  ) {
    this.zoneId = data.zoneId;
  }


  public onAttach(): void {
    this.dialogRef.close(this.selectedIso);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
