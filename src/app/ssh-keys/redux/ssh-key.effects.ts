import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { SSHKeyPairService } from '../../shared/services/ssh-keypair.service';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import { SshPrivateKeyDialogComponent } from '../ssh-key-creation/ssh-private-key-dialog.component';
import { MatDialog } from '@angular/material';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { sshKeyId } from './ssh-key.reducers';
import { Router } from '@angular/router';
import { Utils } from '../../shared/services/utils/utils.service';

import * as sshKey from './ssh-key.actions';


@Injectable()
export class SshKeyEffects {
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
      return this.sshKeyService.remove({
        name: action.payload.name,
        account: action.payload.account,
        domainid: action.payload.domainid
      })
        .map(() => {
          return new sshKey.RemoveSshKeyPairSuccessAction(sshKeyId(action.payload));
        })
        .catch((error: Error) => {
          return Observable.of(new sshKey.RemoveSshKeyPairErrorAction(error));
        });
    });

  @Effect({ dispatch: false })
  removeSshKeyPairSuccessNavigate$: Observable<Action> = this.actions$
    .ofType(sshKey.SSH_KEY_PAIR_REMOVE_SUCCESS)
    .map((action: sshKey.RemoveSshKeyPairSuccessAction) => action.payload)
    .filter(res => res.id === Utils.deepestActivatedRoute(this.router))
    .do(() => {
      this.router.navigate(['./ssh-keys'], {
        queryParamsHandling: 'preserve'
      });
    });

  @Effect()
  createSshKeyPair$: Observable<Action> = this.actions$
    .ofType(sshKey.SSH_KEY_PAIR_CREATE)
    .switchMap((action: sshKey.CreateSshKeyPair) => {
      return (action.payload.publicKey
        ? this.sshKeyService.register(action.payload)
        : this.sshKeyService.create(action.payload))
        .map(createdKey => new sshKey.CreateSshKeyPairSuccessAction(createdKey))
        .catch((error: Error) => {
          return Observable.of(new sshKey.CreateSshKeyPairErrorAction(error));
        });
    });

  @Effect({ dispatch: false })
  createSshKeySuccessPair$: Observable<Action> = this.actions$
    .ofType(sshKey.SSH_KEY_PAIR_CREATE_SUCCESS)
    .filter((action: sshKey.CreateSshKeyPairSuccessAction) => !!action.payload.privateKey)
    .do((action: sshKey.CreateSshKeyPairSuccessAction) => {
      this.showPrivateKey(action.payload.privateKey);
    });

  @Effect({ dispatch: false })
  createSshKeyErrorPair$: Observable<Action> = this.actions$
    .ofType(sshKey.SSH_KEY_PAIR_CREATE_ERROR)
    .do((action: sshKey.CreateSshKeyPairErrorAction) => {
      this.handleError(action.payload);
    });

  @Effect({ dispatch: false })
  removeSshKeyErrorPair$: Observable<Action> = this.actions$
    .ofType(sshKey.SSH_KEY_PAIR_REMOVE_ERROR)
    .do((action: sshKey.RemoveSshKeyPairErrorAction) => {
      this.handleError(action.payload);
    });

  constructor(
    private actions$: Actions,
    private sshKeyService: SSHKeyPairService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private router: Router
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
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }

}
