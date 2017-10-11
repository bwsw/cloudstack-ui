import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { SSHKeyPairService } from '../../shared/services/ssh-keypair.service';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';
import { AuthService } from '../../shared/services/auth.service';

import * as sshKey from './ssh-key.actions';

@Injectable()
export class SshKeyEffects {
  @Effect()
  loadFilterSshKeysByGroupings$: Observable<Action> = this.actions$
    .ofType(sshKey.SSH_KEY_FILTER_UPDATE)
    .map((action: sshKey.SshKeyFilterUpdate) => {
      console.log('ACTION', action);
      return new sshKey.LoadSshKeyRequest(action.payload);
    });

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
  deleteSshKeyPair$: Observable<Action> = this.actions$
    .ofType(sshKey.REMOVE_SSH_KEY_PAIR)
    .switchMap((action: sshKey.RemoveSshKeyPair) => {
      return this.sshKeyService.remove(
        this.authService.isAdmin()
          ? {
            name: action.payload.name,
            account: action.payload.account,
            domainid: action.payload.domainid
          } : { name: action.payload.name });
    });

  @Effect()
  createSshKeyPair$: Observable<Action> = this.actions$
    .ofType(sshKey.CREATE_SSH_KEY_PAIR)
    .switchMap((action: sshKey.CreateSshKeyPair) => {
      return action.payload.publicKey
        ? this.sshKeyService.register(action.payload)
        : this.sshKeyService.create(action.payload);
    });

  constructor(
    private actions$: Actions,
    private sshKeyService: SSHKeyPairService,
    private authService: AuthService
  ) {
  }
}
