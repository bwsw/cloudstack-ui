import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as accountEvent from './accounts.actions';
import { Action } from '@ngrx/store';
import { AccountService } from '../../shared/services/account.service';

@Injectable()
export class AccountsEffects {

  @Effect()
  loadFilterEventsByDate$: Observable<Action> = this.actions$
    .ofType(accountEvent.ACCOUNT_FILTER_UPDATE)
    .map((action: accountEvent.AccountFilterUpdate) => new accountEvent.LoadAccountsRequest({}));

  @Effect()
  loadEvents$: Observable<Action> = this.actions$
    .ofType(accountEvent.LOAD_ACCOUNTS_REQUEST)
    .switchMap((action: accountEvent.LoadAccountsRequest) => {
      return this.accountService.getList(action.payload)
        .map((accounts: Account[]) => {
          return new accountEvent.LoadAccountsResponse(accounts);
        })
        .catch(() => Observable.of(new accountEvent.LoadAccountsResponse(
          { accounts: [], roles: [] })));
    });

  constructor(
    private actions$: Actions,
    private accountService: AccountService
  ) {
  }
}
