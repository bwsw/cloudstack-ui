import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import { NotificationService } from '../../shared/services/notification.service';


@Component({
  selector: 'cs-ssh-key-creation-asd',
  templateUrl: 'ssh-private-key-dialog.component.html'
})
export class SshPrivateKeyDialogComponent {
  constructor(
    public dialog: MdlDialogReference,
    @Inject('privateKey') public privateKey: string,
    private notificationService: NotificationService,
    private translationService: TranslateService
  ) { }

  public onCopySuccess(): void {
    this.translationService.get('COPY_SUCCESS')
      .subscribe(str => this.notificationService.message(str));
  }

  public onCopyFail(): void {
    this.translationService.get('COPY_FAIL')
      .subscribe(str => this.notificationService.message(str));
  }
}
