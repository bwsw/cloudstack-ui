import { Component, OnInit } from '@angular/core';
import { TemplatePageComponent } from '../template-page/template-page.component';
import { Iso } from '../shared/iso.model';
import { MdlDialogReference, MdlDialogService } from 'angular2-mdl';
import { IsoService } from '../shared/iso.service';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { TranslateService } from 'ng2-translate';
import { TemplateService } from '../shared/template.service';
import { NotificationService } from '../../shared/services/notification.service';
import { VmService } from '../../vm/shared/vm.service';
import { AuthService } from '../../shared/services/auth.service';
import { StorageService } from '../../shared/services/storage.service';


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
