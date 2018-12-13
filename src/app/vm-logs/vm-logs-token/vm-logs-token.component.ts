import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { VmLogsToken } from '../models/vm-log-token.model';
import { SnackBarService } from '../../core/services';

@Component({
  selector: 'cs-vm-logs-token',
  templateUrl: 'vm-logs-token.component.html',
})
export class VmLogsTokenComponent {
  constructor(
    public dialogRef: MatDialogRef<VmLogsTokenComponent>,
    @Inject(MAT_DIALOG_DATA) public token: VmLogsToken,
    private notificationService: SnackBarService,
  ) {}

  public onCopySuccess(): void {
    this.notificationService.open('CLIPBOARD.COPY_SUCCESS').subscribe();
  }

  public onCopyFail(): void {
    this.notificationService.open('CLIPBOARD.COPY_FAIL').subscribe();
  }
}
