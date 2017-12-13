import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SSHKeyPair } from '../../../shared/models/ssh-keypair.model';

@Component({
  selector: 'cs-ssh-keypair-reset',
  templateUrl: 'ssh-keypair-reset.component.html',
  styleUrls: ['ssh-keypair-reset.component.scss']
})
export class SshKeypairResetComponent implements OnInit {
  public resettingKeyInProgress = false;
  public sshKeyList: Array<SSHKeyPair>;
  public selectedSshKeyName: string;

  constructor(
    private dialogRef: MatDialogRef<SshKeypairResetComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {
    this.sshKeyList = data.keys;
  }

  public ngOnInit(): void {
    this.selectedSshKeyName = this.sshKeyList[0].name;
  }

  public resetSshKey(): void {
    this.dialogRef.close(this.selectedSshKeyName);
  }
}
