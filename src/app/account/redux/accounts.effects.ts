import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as accountActions from './accounts.actions';
import { Action } from '@ngrx/store';
import { AccountService } from '../../shared/services/account.service';

@Injectable()
export class AccountsEffects {

  @Effect()
  loadFilteredAccounts: Observable<Action> = this.actions$
    .ofType(accountActions.ACCOUNT_FILTER_UPDATE)
    .map((action: accountActions.AccountFilterUpdate) => new accountActions.LoadAccountsRequest());

  @Effect()
  loadAccounts$: Observable<Action> = this.actions$
    .ofType(accountActions.LOAD_ACCOUNTS_REQUEST)
    .switchMap((action: accountActions.LoadAccountsRequest) => {
      return this.accountService.getList(action.payload)
        .map((accounts: Account[]) => {
          return new accountActions.LoadAccountsResponse(accounts);
        })
        .catch(() => Observable.of(new accountActions.LoadAccountsResponse([])));
    });

  constructor(
    private actions$: Actions,
    private accountService: AccountService
  ) {
  }
}
