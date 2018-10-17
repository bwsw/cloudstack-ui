import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SSHKeyPair } from '../../../shared/models/ssh-keypair.model';

@Component({
  selector: 'cs-ssh-keypair-reset',
  templateUrl: 'ssh-keypair-reset.component.html',
  styleUrls: ['ssh-keypair-reset.component.scss'],
})
export class SshKeypairResetComponent {
  public resettingKeyInProgress = false;
  public sshKeyList: SSHKeyPair[];
  public selectedSshKeyName: string;
  public preselectedSshKeyName: string;

  constructor(
    private dialogRef: MatDialogRef<SshKeypairResetComponent>,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    this.sshKeyList = data.keys;
    this.preselectedSshKeyName = data.sshKeyName;
    this.selectedSshKeyName = this.preselectedSshKeyName;
  }

  public resetSshKey(): void {
    this.dialogRef.close(this.selectedSshKeyName);
  }
}
