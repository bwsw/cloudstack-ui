import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { SSHKeyPairService } from '../../shared/services/ssh-keypair.service';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import { AuthService } from '../../shared/services/auth.service';
import { SshPrivateKeyDialogComponent } from '../ssh-key-creation/ssh-private-key-dialog.component';
import { MdDialog } from '@angular/material';
import { DialogService } from '../../dialog/dialog-service/dialog.service';

import * as sshKey from './ssh-key.actions';

@Injectable()
export class SshKeyEffects {
  @Effect()
  loadFilterSshKeysByGroupings$: Observable<Action> = this.actions$
    .ofType(sshKey.SSH_KEY_FILTER_UPDATE)
    .map((action: sshKey.SshKeyFilterUpdate) => new sshKey.LoadSshKeyRequest());

  @Effect()
  loadSshKeys$: Observable<Action> = this.actions$
    .ofType(sshKey.LOAD_SSH_KEYS_REQUEST)
    .switchMap((action: sshKey.LoadSshKeyRequest) => {
      return this.sshKeyService
        .getListAll(action.payload)
        .map((sshKeys: SSHKeyPair[]) => new sshKey.LoadSshKeyResponse(sshKeys))
        .catch(() => Observable.of(new sshKey.LoadSshKeyResponse([])));
    });

  @Effect()
  removeSshKeyPair$: Observable<Action> = this.actions$
    .ofType(sshKey.SSH_KEY_PAIR_REMOVE)
    .switchMap((action: sshKey.RemoveSshKeyPair) => {
      return this.sshKeyService.remove(
        this.authService.isAdmin()
          ? {
            name: action.payload.name,
            account: action.payload.account,
            domainid: action.payload.domainid
          } : { name: action.payload.name })
        .map((success: boolean) => {
          if (success) {
            return new sshKey.RemoveSshKeyPairSuccessAction(Object.assign(
              {},
              success,
              { name: action.payload.name }
            ));
          }
        })
        .catch((error: Error) =>
          Observable.of(new sshKey.RemoveSshKeyPairErrorAction(error)));
    });

  @Effect()
  createSshKeyPair$: Observable<Action> = this.actions$
    .ofType(sshKey.SSH_KEY_PAIR_CREATE)
    .switchMap((action: sshKey.CreateSshKeyPair) => {
      return (action.payload.publicKey
        ? this.sshKeyService.register(action.payload)
        : this.sshKeyService.create(action.payload))
        .map(createdKey => {
          if (createdKey && createdKey.privateKey) {
            this.showPrivateKey(createdKey.privateKey);
          }
          return new sshKey.CreateSshKeyPairSuccessAction(createdKey);
        })
        .catch((error: Error) => {
          this.handleError(error);
          return Observable.of(new sshKey.CreateSshKeyPairErrorAction(error));
        });
    });

  constructor(
    private actions$: Actions,
    private sshKeyService: SSHKeyPairService,
    private authService: AuthService,
    private dialog: MdDialog,
    private dialogService: DialogService
  ) {
  }

  private showPrivateKey(privateKey: string): void {
    this.dialog.open(SshPrivateKeyDialogComponent, {
      data: privateKey,
      width: '400px',
    })
      .beforeClose()
      .subscribe(() => this.dialog.closeAll());
  }

  private handleError(error): void {
    if (error) {
      this.dialogService.alert({
        message: {
          translationToken: error.message,
          interpolateParams: error.params
        }
      });
    }
  }

}
