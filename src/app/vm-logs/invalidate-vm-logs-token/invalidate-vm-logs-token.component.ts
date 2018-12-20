import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { VirtualMachine } from '../../vm';

@Component({
  selector: 'cs-invalidate-vm-logs-token',
  templateUrl: 'invalidate-vm-logs-token.component.html',
})
export class InvalidateVmLogsTokenComponent {
  public token: string;

  constructor(
    public dialogRef: MatDialogRef<InvalidateVmLogsTokenComponent>,
    @Inject(MAT_DIALOG_DATA) public vm: VirtualMachine,
  ) {}

  public onInvalidate() {
    this.dialogRef.close(this.token);
  }
}
