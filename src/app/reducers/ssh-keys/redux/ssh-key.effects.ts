import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  onErrorResumeNext,
  switchMap,
  tap,
} from 'rxjs/operators';

import { SSHKeyPairService } from '../../../shared/services/ssh-keypair.service';
import { SnackBarService } from '../../../core/services';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';

import { SSHKeyPair } from '../../../shared/models';
import { SshPrivateKeyDialogComponent } from '../../../ssh-keys/ssh-key-creation/ssh-private-key-dialog.component';

import * as sshKeyActions from './ssh-key.actions';

@Injectable()
export class SshKeyEffects {
  @Effect()
  loadSshKeys$: Observable<Action> = this.actions$.pipe(
    ofType(sshKeyActions.LOAD_SSH_KEYS_REQUEST),
    switchMap((action: sshKeyActions.LoadSshKeyRequest) => {
      return this.sshKeyService.getListAll(action.payload).pipe(
        map((sshKeys: SSHKeyPair[]) => new sshKeyActions.LoadSshKeyResponse(sshKeys)),
        catchError(() => of(new sshKeyActions.LoadSshKeyResponse([]))),
      );
    }),
  );

  @Effect()
  removeSshKeyPair$: Observable<Action> = this.actions$.pipe(
    ofType(sshKeyActions.SSH_KEY_PAIR_REMOVE),
    mergeMap((action: sshKeyActions.RemoveSshKeyPair) => {
      return this.dialogService.confirm({ message: 'SSH_KEYS.REMOVE_THIS_KEY' }).pipe(
        onErrorResumeNext(),
        filter(res => !!res),
        switchMap(() => {
          return this.sshKeyService
            .remove({
              name: action.payload.name,
              account: action.payload.account,
              domainid: action.payload.domainid,
            })
            .pipe(
              tap(() => {
                const message = 'NOTIFICATIONS.SSH_KEY.DELETE_DONE';
                this.showNotificationsOnFinish(message);
              }),
              map(() => new sshKeyActions.RemoveSshKeyPairSuccessAction(action.payload)),
              catchError((error: Error) => {
                this.dialogService.showNotificationsOnFail(error);
                return of(new sshKeyActions.RemoveSshKeyPairErrorAction(error));
              }),
            );
        }),
      );
    }),
  );

  @Effect({ dispatch: false })
  removeSshKeyPairSuccessNavigate$: Observable<SSHKeyPair> = this.actions$.pipe(
    ofType(sshKeyActions.SSH_KEY_PAIR_REMOVE_SUCCESS),
    map((action: sshKeyActions.RemoveSshKeyPairSuccessAction) => action.payload),
    filter((sshKey: SSHKeyPair) => {
      return (
        this.router.isActive(`/ssh-keys/view/${sshKey.name}`, false) &&
        this.router.routerState.root.snapshot.queryParams.account === sshKey.account
      );
    }),
    tap(() => {
      this.router.navigate(['./ssh-keys'], {
        queryParamsHandling: 'preserve',
      });
    }),
  );

  @Effect()
  createSshKeyPair$: Observable<Action> = this.actions$.pipe(
    ofType(sshKeyActions.SSH_KEY_PAIR_CREATE),
    mergeMap((action: sshKeyActions.CreateSshKeyPair) => {
      return (action.payload.publicKey
        ? this.sshKeyService.register(action.payload)
        : this.sshKeyService.create(action.payload)
      ).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.SSH_KEY.CREATION_DONE';
          this.showNotificationsOnFinish(message);
        }),
        map(createdKey => new sshKeyActions.CreateSshKeyPairSuccessAction(createdKey)),
        catchError((error: Error) => {
          this.dialogService.showNotificationsOnFail(error);
          return of(new sshKeyActions.CreateSshKeyPairErrorAction(error));
        }),
      );
    }),
  );

  @Effect({ dispatch: false })
  createSshKeySuccessPair$: Observable<Action> = this.actions$.pipe(
    ofType(sshKeyActions.SSH_KEY_PAIR_CREATE_SUCCESS),
    tap((action: sshKeyActions.CreateSshKeyPairSuccessAction) => {
      if (action.payload.privatekey) {
        this.showPrivateKey(action.payload.privatekey);
      } else {
        this.dialog.closeAll();
      }
    }),
  );

  constructor(
    private actions$: Actions,
    private sshKeyService: SSHKeyPairService,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private router: Router,
    private snackBarService: SnackBarService,
  ) {}

  private showPrivateKey(privateKey: string): void {
    this.dialog
      .open(SshPrivateKeyDialogComponent, {
        data: privateKey,
        width: '400px',
      })
      .beforeClose()
      .subscribe(() => this.dialog.closeAll());
  }

  private showNotificationsOnFinish(message: string) {
    this.snackBarService.open(message).subscribe();
  }
}
