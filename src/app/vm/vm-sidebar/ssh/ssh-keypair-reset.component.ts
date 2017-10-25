import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { SSHKeyPair } from '../../../shared/models/ssh-keypair.model';
import { SSHKeyPairService } from '../../../shared/services/ssh-keypair.service';

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
    private dialogService: DialogService,
    private dialogRef: MatDialogRef<SshKeypairResetComponent>,
    @Inject(MAT_DIALOG_DATA) private vm,
    private sshService: SSHKeyPairService
  ) { }

  public ngOnInit(): void {
    this.sshService.getList().subscribe(keys => {
      this.sshKeyList = keys;
      if (this.sshKeyList.length) {
        this.selectedSshKeyName = this.sshKeyList[0].name;
      }
    });
  }

  public resetSshKey(): void {
    this.resettingKeyInProgress = true;
    this.sshService.reset({ id: this.vm.id, keypair: this.selectedSshKeyName })
      .finally(() => this.resettingKeyInProgress = false)
      .subscribe(
        vm => this.dialogRef.close(vm.keyPair),
        error => this.dialogService.alert({ message: error.message })
      );
  }
}
