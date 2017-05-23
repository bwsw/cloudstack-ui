import { Component } from '@angular/core';
import { MdlDialogReference } from '@angular-mdl/core';
import { SshKeyCreationData, SSHKeyPairService } from '../../shared/services/ssh-keypair.service';
import { Observable } from 'rxjs/Observable';
import { SSHKeyPair } from '../../shared/models';
import { DialogService } from '../../shared/services/dialog/dialog.service';


@Component({
  selector: 'cs-ssh-key-creation-dialog',
  templateUrl: 'ssh-key-creation-dialog.component.html',
  styleUrls: ['ssh-key-creation-dialog.component.scss']
})
export class SShKeyCreationDialogComponent {
  public name: string;
  public publicKey: string;
  public loading: boolean;

  constructor(
    public dialog: MdlDialogReference,
    public dialogService: DialogService,
    public sshKeyPairService: SSHKeyPairService
  ) { }

  public onSubmit(e): void {
    e.preventDefault();
    const sshKeyCreationParams = {
      name: this.name,
      publicKey: this.publicKey
    };

    this.loading = true;
    this.createSshKey(sshKeyCreationParams)
      .finally(() => this.loading = false)
      .subscribe(
        sshKeyPair => this.dialog.hide(sshKeyPair),
        error => this.handleError(error)
      );
  }

  private createSshKey(data: SshKeyCreationData): Observable<SSHKeyPair> {
    return data.publicKey ?
      this.sshKeyPairService.register(data) :
      this.sshKeyPairService.create(data);
  }

  private handleError(error): void {
    this.dialogService.alert({
      translationToken: error.message,
      interpolateParams: error.params
    });
  }
}
