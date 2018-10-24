import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { SnackBarService } from '../../core/services';

@Component({
  selector: 'cs-ssh-private-key-dialog',
  templateUrl: 'ssh-private-key-dialog.component.html',
})
export class SshPrivateKeyDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public privateKey: string,
    private notificationService: SnackBarService,
  ) {}

  public onCopySuccess(): void {
    this.notificationService.open('CLIPBOARD.COPY_SUCCESS').subscribe();
  }

  public onCopyFail(): void {
    this.notificationService.open('CLIPBOARD.COPY_FAIL').subscribe();
  }
}
