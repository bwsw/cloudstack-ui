import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { SSHKeyPairService } from '../../../shared/services/ssh-keypair.service';
import { SnackBarService } from '../../../core/services';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';

import { SSHKeyPair } from '../../../shared/models';
import { SshPrivateKeyDialogComponent } from '../../../ssh-keys/ssh-key-creation/ssh-private-key-dialog.component';

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
    .mergeMap((action: sshKey.RemoveSshKeyPair) => {
      return this.dialogService.confirm({ message: 'SSH_KEYS.REMOVE_THIS_KEY' })
        .onErrorResumeNext()
        .filter(res => !!res)
        .switchMap(() => {
          return this.sshKeyService.remove({
            name: action.payload.name,
            account: action.payload.account,
            domainid: action.payload.domainid
          })
            .do(() => {
              const message = 'NOTIFICATIONS.SSH_KEY.DELETE_DONE';
              this.showNotificationsOnFinish(message);
            })
            .map(() => new sshKey.RemoveSshKeyPairSuccessAction(action.payload))
            .catch((error: Error) => {
              this.showNotificationsOnFail(error);
              return Observable.of(new sshKey.RemoveSshKeyPairErrorAction(error));
            });
        });
    });

  @Effect({ dispatch: false })
  removeSshKeyPairSuccessNavigate$: Observable<SSHKeyPair> = this.actions$
    .ofType(sshKey.SSH_KEY_PAIR_REMOVE_SUCCESS)
    .map((action: sshKey.RemoveSshKeyPairSuccessAction) => action.payload)
    .filter((sshKey: SSHKeyPair) => {
      return this.router.isActive(`/ssh-keys/view/${sshKey.name}`, false)
        && this.router.routerState.root.snapshot.queryParams.account === sshKey.account;
    })
    .do(() => {
      this.router.navigate(['./ssh-keys'], {
        queryParamsHandling: 'preserve'
      });
    });

  @Effect()
  createSshKeyPair$: Observable<Action> = this.actions$
    .ofType(sshKey.SSH_KEY_PAIR_CREATE)
    .mergeMap((action: sshKey.CreateSshKeyPair) => {
      return (action.payload.publicKey
        ? this.sshKeyService.register(action.payload)
        : this.sshKeyService.create(action.payload)
      )
        .do(() => {
          const message = 'NOTIFICATIONS.SSH_KEY.CREATION_DONE';
          this.showNotificationsOnFinish(message);
        })
        .map(createdKey => new sshKey.CreateSshKeyPairSuccessAction(createdKey))
        .catch((error: Error) => {
          this.showNotificationsOnFail(error);
          return Observable.of(new sshKey.CreateSshKeyPairErrorAction(error));
        });
    });

  @Effect({ dispatch: false })
  createSshKeySuccessPair$: Observable<Action> = this.actions$
    .ofType(sshKey.SSH_KEY_PAIR_CREATE_SUCCESS)
    .do((action: sshKey.CreateSshKeyPairSuccessAction) => {
      if (action.payload.privatekey) {
        this.showPrivateKey(action.payload.privatekey);
      } else {
        this.dialog.closeAll();
      }
    });

  constructor(
    private actions$: Actions,
    private sshKeyService: SSHKeyPairService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private router: Router,
    private snackBarService: SnackBarService
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

  private showNotificationsOnFinish(message: string) {
    this.snackBarService.open(message).subscribe();
  }

  private showNotificationsOnFail(error: any) {
    this.dialogService.alert({ message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }

}
