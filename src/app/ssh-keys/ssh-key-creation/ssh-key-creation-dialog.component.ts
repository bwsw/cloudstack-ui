import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DialogsService } from '../../dialog/dialog-service/dialog.service';
import { SSHKeyPair } from '../../shared/models';
import { SshKeyCreationData, SSHKeyPairService } from '../../shared/services/ssh-keypair.service';


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
    public dialogRef: MdDialogRef<SShKeyCreationDialogComponent>,
    public dialogsService: DialogsService,
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
        sshKeyPair => this.dialogRef.close(sshKeyPair),
        error => this.handleError(error)
      );
  }

  private createSshKey(data: SshKeyCreationData): Observable<SSHKeyPair> {
    return data.publicKey ?
      this.sshKeyPairService.register(data) :
      this.sshKeyPairService.create(data);
  }

  private handleError(error): void {
    this.dialogsService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }
}
