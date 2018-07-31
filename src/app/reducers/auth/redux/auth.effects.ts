import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as authActions from './auth.actions';
import { Action } from '@ngrx/store';
import { Account } from '../../../shared/models';
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

  constructor(
    private actions$: Actions,
    private accountService: AccountService
  ) {
  }
}
