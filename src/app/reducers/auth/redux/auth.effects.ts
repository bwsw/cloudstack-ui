import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as authActions from './auth.actions';
import { Action } from '@ngrx/store';
import { AccountService } from '../../../shared/services/account.service';

@Injectable()
export class UserAccountEffects {

  @Effect()
  loadUserAccount$: Observable<Action> = this.actions$
    .ofType(authActions.LOAD_USER_ACCOUNT_REQUEST)
    .switchMap((action: authActions.LoadUserAccountRequest) => {
      return this.accountService.getAccount(action.payload)
        .map((account: Account) => {
          return new authActions.LoadUserAccountResponse(account);
        })
        .catch(() => Observable.of(new authActions.LoadUserAccountResponse({})));
    });

  /*@Effect()
  updateUserAccount$: Observable<Action> = this.actions$
    .ofType(
      vmActions.CREATE_VM_SUCCESS,
      vmActions.EXPUNGE_VM_SUCCESS,
      volumeActions.VOLUME_DELETE_SUCCESS,
      volumeActions.VOLUME_CREATE_SUCCESS,
      volumeActions.ADD_SNAPSHOT_SUCCESS,
      volumeActions.DELETE_SNAPSHOT_SUCCESS,
      volumeActions.RESIZE_VOLUME_SUCCESS
    )
    .map(() => {
      return new authActions.LoadUserAccountRequest();
    });*/

  constructor(
    private actions$: Actions,
    private accountService: AccountService
  ) {
  }
}
