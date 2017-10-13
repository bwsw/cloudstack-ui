import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { SSHKeyPair } from '../../shared/models';
import { SshKeyCreationData } from '../../shared/services/ssh-keypair.service';
import { Store } from '@ngrx/store';

import * as sshKeyActions from '../redux/ssh-key.actions';
import * as fromSshKeys from '../redux/ssh-key.reducers';

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
    public dialogService: DialogService,
    public store: Store<SSHKeyPair>
  ) {
  }

  public onSubmit(e): void {
    e.preventDefault();
    const sshKeyCreationParams = {
      name: this.name,
      publicKey: this.publicKey
    };

    this.loading = true;
    this.createSshKey(sshKeyCreationParams);
  }

  private createSshKey(data: SshKeyCreationData) {
    this.store.dispatch(new sshKeyActions.CreateSshKeyPair(data));
    this.store.select(fromSshKeys.selectSshKey).subscribe(
      key => {
        if (key) {
          this.loading = false;
          this.dialogRef.close(key);
        }

        // else {
        //   // @todo: error handler ???
        //   this.handleError({
        //     translationToken: 'Message',
        //     interpolateParams: 'params'
        //   });
        // }
      }
    );
  }

  private handleError(error): void {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }
}
