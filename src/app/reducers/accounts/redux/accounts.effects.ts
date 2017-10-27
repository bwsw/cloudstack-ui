import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as accountActions from './accounts.actions';
import { Action } from '@ngrx/store';
import { AccountService } from '../../../shared/services/account.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';

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

  @Effect()
  createAccount$: Observable<Action> = this.actions$
    .ofType(accountActions.CREATE_ACCOUNT)
    .switchMap((action: accountActions.CreateAccount) => {
      return this.accountService.create(action.payload)
        .map(createdAccount => new accountActions.CreateSuccess(createdAccount))
        .catch((error: Error) => {
          return Observable.of(new accountActions.CreateError(error));
        });
    });

  @Effect({ dispatch: false })
  createError$: Observable<Action> = this.actions$
    .ofType(accountActions.ACCOUNT_CREATE_ERROR)
    .do((action: accountActions.CreateError) => {
      this.handleError(action.payload);
    });

  constructor(
    private actions$: Actions,
    private accountService: AccountService,
    private dialogService: DialogService
  ) {
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
