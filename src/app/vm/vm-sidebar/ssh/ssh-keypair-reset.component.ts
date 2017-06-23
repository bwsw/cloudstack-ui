import { Component, Inject, OnInit } from '@angular/core';
import { DialogService } from '../../../dialog/dialog-module/dialog.service';
import { MdlDialogReference } from '../../../dialog/dialog-module/mdl-dialog.service';
import { SSHKeyPair } from '../../../shared/models/ssh-keypair.model';
import { SSHKeyPairService } from '../../../shared/services/ssh-keypair.service';

@Component({
  selector: 'cs-ssh-keypair-reset',
  templateUrl: 'ssh-keypair-reset.component.html'
})
export class SshKeypairResetComponent implements OnInit {
  public resettingKeyInProgress = false;
  public sshKeyList: Array<SSHKeyPair>;
  public selectedSshKeyName: string;

  constructor(
    private dialog: MdlDialogReference,
    private dialogService: DialogService,
    @Inject('virtualMachine') private vm,
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

  public hide(): void {
    this.dialog.hide();
  }

  public resetSshKey(): void {
    this.resettingKeyInProgress = true;
    this.sshService.reset({ id: this.vm.id, keypair: this.selectedSshKeyName })
      .finally(() => this.resettingKeyInProgress = false)
      .subscribe(
        vm => this.dialog.hide(vm.keyPair),
        error => this.dialogService.alert(error.message)
      );
  }
}
