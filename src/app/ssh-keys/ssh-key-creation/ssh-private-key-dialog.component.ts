import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

import { NotificationService } from '../../shared/services/notification.service';


@Component({
  selector: 'cs-ssh-private-key-dialog',
  templateUrl: 'ssh-private-key-dialog.component.html'
})
export class SshPrivateKeyDialogComponent {
  constructor(
    public dialogRef: MdDialogRef<SshPrivateKeyDialogComponent>,
    @Inject(MD_DIALOG_DATA) public privateKey: string,
    private notificationService: NotificationService
  ) { }

  public onCopySuccess(): void {
    this.notificationService.message('CLIPBOARD.COPY_SUCCESS');
  }

  public onCopyFail(): void {
    this.notificationService.message('CLIPBOARD.COPY_FAIL');
  }
}
