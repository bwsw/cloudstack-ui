import { Component, Inject } from '@angular/core';

import { Iso } from '../shared';
import { MdlDialogReference } from '../../dialog/dialog-module';
import { IsoService } from '../shared/iso.service';


@Component({
  selector: 'cs-iso-attachment',
  templateUrl: 'iso-attachment.component.html',
  styleUrls: ['iso-attachment.component.scss', '../../shared/styles/iso-dialog.scss']
})
export class IsoAttachmentComponent {
  public selectedIso: Iso;
  public showIso = true;
  public isos: Array<Iso> = [];

  constructor(
    @Inject('zoneId') public zoneId: string,
    private dialog: MdlDialogReference,
    private isoService: IsoService
  ) {
    this.load();
  }

  public load() {
    this.isoService.getGroupedTemplates<Iso>({}, null, true)
      .subscribe((isos) => {
        this.isos = isos.toArray();
      });
  }

  public onAttach(): void {
    this.dialog.hide(this.selectedIso);
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
