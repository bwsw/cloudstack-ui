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
import { Account } from '../../../shared/models/account.model';
import { AsyncJobService } from '../../../shared/services/async-job.service';

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
  disableAccount$: Observable<Action> = this.actions$
    .ofType(accountActions.DISABLE_ACCOUNT)
    .switchMap((action: accountActions.DisableAccountRequest) => {
      return this.accountService.disableAccount(action.payload)
        .switchMap(job => {
          return this.asyncJobService.queryJob(job, 'account', Account);
        })
        .map(updatedAccount => new accountActions.UpdateAccounts(updatedAccount))
        .catch((error: Error) => {
          return Observable.of(new accountActions.AccountUpdateError(error));
        });
    });

  @Effect()
  enableAccount$: Observable<Action> = this.actions$
    .ofType(accountActions.ENABLE_ACCOUNT)
    .switchMap((action: accountActions.EnableAccountRequest) => {
      return this.accountService.enableAccount(action.payload)
        .map(res => new accountActions.UpdateAccounts(res.account))
        .catch((error: Error) => {
          return Observable.of(new accountActions.AccountUpdateError(error));
        });
    });

  @Effect()
  lockAccount$: Observable<Action> = this.actions$
    .ofType(accountActions.LOCK_ACCOUNT)
    .switchMap((action: accountActions.LockAccountRequest) => {
      return this.accountService.lockAccount(action.payload)
        .switchMap(job => {
          return this.asyncJobService.queryJob(job, 'account', Account);
        })
        .map(updatedAccount => new accountActions.UpdateAccounts(updatedAccount))
        .catch((error: Error) => {
          return Observable.of(new accountActions.AccountUpdateError(error));
        });
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

  @Effect({ dispatch: false })
  updateError$: Observable<Action> = this.actions$
    .ofType(accountActions.ACCOUNT_UPDATE_ERROR)
    .do((action: accountActions.AccountUpdateError) => {
      this.handleError(action.payload);
    });

  constructor(
    private actions$: Actions,
    private accountService: AccountService,
    private asyncJobService: AsyncJobService,
    private dialogService: DialogService,
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
