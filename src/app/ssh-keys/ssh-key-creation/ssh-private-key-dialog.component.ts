import { Component, Inject } from '@angular/core';

import { NotificationService } from '../../shared/services/notification.service';
import { MdlDialogReference } from '../../dialog/dialog-module';


@Component({
  selector: 'cs-ssh-key-creation-asd',
  templateUrl: 'ssh-private-key-dialog.component.html'
})
export class SshPrivateKeyDialogComponent {
  constructor(
    public dialog: MdlDialogReference,
    @Inject('privateKey') public privateKey: string,
    private notificationService: NotificationService
  ) { }

  public onCopySuccess(): void {
    this.notificationService.message('COPY_SUCCESS');
  }

  public onCopyFail(): void {
    this.notificationService.message('COPY_FAIL');
  }
}
