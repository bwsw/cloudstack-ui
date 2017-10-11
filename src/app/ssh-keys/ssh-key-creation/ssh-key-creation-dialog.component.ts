import { Component, EventEmitter } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { SSHKeyPair } from '../../shared/models';
import {
  SshKeyCreationData,
  SSHKeyPairService
} from '../../shared/services/ssh-keypair.service';
import { Store } from '@ngrx/store';

import * as sshKeyActions from '../redux/ssh-key.actions';
import { Action } from '../../shared/interfaces/action.interface';

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
    //   .finally(() => this.loading = false)
    //   .subscribe(
    //     sshKeyPair => this.dialogRef.close(sshKeyPair),
    //     error => this.handleError(error)
    //   );
  }

  private createSshKey(data: SshKeyCreationData) {
    this.store.dispatch(new sshKeyActions.CreateSshKeyPair(data));
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
