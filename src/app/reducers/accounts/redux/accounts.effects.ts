import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { Account } from '../../../shared/models/account.model';
import { AccountService } from '../../../shared/services/account.service';
import { AsyncJobService } from '../../../shared/services/async-job.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { UserService } from '../../../shared/services/user.service';
import * as vmActions from '../../vm/redux/vm.actions';
import * as volumeActions from '../../volumes/redux/volumes.actions';

import * as accountActions from './accounts.actions';

@Injectable()
export class AccountsEffects {

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
  updateAccounts$: Observable<Action> = this.actions$
    .ofType(
      vmActions.VM_DEPLOYMENT_REQUEST_SUCCESS,
      vmActions.EXPUNGE_VM_SUCCESS,
      volumeActions.VOLUME_DELETE_SUCCESS,
      volumeActions.VOLUME_CREATE_SUCCESS,
      volumeActions.ADD_SNAPSHOT_SUCCESS,
      volumeActions.DELETE_SNAPSHOT_SUCCESS,
      volumeActions.RESIZE_VOLUME_SUCCESS
    )
    .map(() => {
      return new accountActions.LoadAccountsRequest();
    });

  @Effect()
  disableAccount$: Observable<Action> = this.actions$
    .ofType(accountActions.DISABLE_ACCOUNT)
    .switchMap((action: accountActions.DisableAccountRequest) => {
      return this.accountService.disableAccount(action.payload)
        .switchMap(job => {
          return this.asyncJobService.queryJob(job, 'account', Account);
        })
        .map(updatedAccount => new accountActions.UpdateAccount(updatedAccount))
        .catch((error: Error) => {
          return Observable.of(new accountActions.AccountUpdateError(error));
        });
    });

  @Effect()
  enableAccount$: Observable<Action> = this.actions$
    .ofType(accountActions.ENABLE_ACCOUNT)
    .switchMap((action: accountActions.EnableAccountRequest) => {
      return this.accountService.enableAccount(action.payload)
        .map(res => new accountActions.UpdateAccount(res.account))
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
        .map(updatedAccount => new accountActions.UpdateAccount(updatedAccount))
        .catch((error: Error) => {
          return Observable.of(new accountActions.AccountUpdateError(error));
        });
    });

  @Effect()
  deleteAccount$: Observable<Action> = this.actions$
    .ofType(accountActions.DELETE_ACCOUNT)
    .switchMap((action: accountActions.LockAccountRequest) => {
      return this.accountService.removeAccount(action.payload)
        .switchMap(job => {
          return this.asyncJobService.queryJob(job, 'account', Account);
        })
        .map(() => new accountActions.DeleteSuccess(action.payload))
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
  accountCreateSuccess$: Observable<Action> = this.actions$
    .ofType(accountActions.ACCOUNT_CREATE_SUCCESS)
    .do((action: accountActions.CreateSuccess) => {
      this.dialog.closeAll();
    });

  @Effect({ dispatch: false })
  deleteSuccessNavigate$: Observable<Account> = this.actions$
    .ofType(accountActions.ACCOUNT_DELETE_SUCCESS)
    .map((action: accountActions.DeleteSuccess) => action.payload)
    .filter((account: Account) => {
      return this.router.isActive(`/accounts/${account.id}`, false);
    })
    .do(() => {
      this.router.navigate(['./accounts'], {
        queryParamsHandling: 'preserve'
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

  @Effect()
  userDelete$: Observable<Action> = this.actions$
    .ofType(accountActions.ACCOUNT_USER_DELETE)
    .switchMap((action: accountActions.AccountUserDelete) =>
      this.userService.removeUser(action.payload)
        .map(() => new accountActions.AccountUserDeleteSuccess(action.payload))
        .catch(error => Observable.of(new accountActions.AccountUpdateError(error))));

  @Effect({ dispatch: false })
  userDeleteSuccess$: Observable<Action> = this.actions$
    .ofType(accountActions.ACCOUNT_USER_DELETE_SUCCESS)
    .do((action: accountActions.AccountUserDeleteSuccess) => this.onNotify(
      action.payload,
      this.successAccountUserRemoveMessage
    ));

  @Effect()
  userCreate$: Observable<Action> = this.actions$
    .ofType(accountActions.ACCOUNT_USER_CREATE)
    .switchMap((action: accountActions.AccountUserCreate) =>
      this.userService.createUser(action.payload)
        .map((user) => new accountActions.AccountUserCreateSuccess(user))
        .catch(error => Observable.of(new accountActions.AccountUpdateError(error))));

  @Effect({ dispatch: false })
  userCreateSuccess$: Observable<Action> = this.actions$
    .ofType(accountActions.ACCOUNT_USER_CREATE_SUCCESS)
    .do((action: accountActions.AccountUserCreateSuccess) => {
      this.onNotify(action.payload, this.successAccountUserCreateMessage);
      this.dialog.closeAll();
    });

  @Effect()
  userUpdate$: Observable<Action> = this.actions$
    .ofType(accountActions.ACCOUNT_USER_UPDATE)
    .switchMap((action: accountActions.AccountUserUpdate) =>
      this.userService.updateUser(action.payload)
        .map((user) => new accountActions.AccountUserUpdateSuccess(user))
        .catch(error => Observable.of(new accountActions.AccountUpdateError(error))));

  @Effect({ dispatch: false })
  userUpdateSuccess$: Observable<Action> = this.actions$
    .ofType(accountActions.ACCOUNT_USER_UPDATE_SUCCESS)
    .do((action: accountActions.AccountUserUpdateSuccess) => this.onNotify(
      action.payload,
      this.successAccountUserUpdateMessage
    ));

  @Effect()
  userGenerateKeys$: Observable<Action> = this.actions$
    .ofType(accountActions.ACCOUNT_USER_GENERATE_KEYS)
    .switchMap((action: accountActions.AccountUserGenerateKey) =>
      this.userService.registerKeys(action.payload.id)
        .map(res => new accountActions.AccountLoadUserKeysSuccess({
          user: action.payload,
          userKeys: res
        }))
        .catch(error => Observable.of(new accountActions.AccountUpdateError(error))));

  @Effect()
  userLoadKeys$: Observable<Action> = this.actions$
    .ofType(accountActions.ACCOUNT_LOAD_USER_KEYS)
    .switchMap((action: accountActions.AccountLoadUserKeys) =>
      this.userService.getUserKeys(action.payload.id)
        .map(res => new accountActions.AccountLoadUserKeysSuccess({
          user: action.payload,
          userKeys: res
        }))
        .catch(error => Observable.of(new accountActions.AccountUpdateError(error))));

  private successAccountUserCreateMessage = 'NOTIFICATIONS.ACCOUNT.USER_CREATED';
  private successAccountUserRemoveMessage = 'NOTIFICATIONS.ACCOUNT.USER_DELETED';
  private successAccountUserUpdateMessage = 'NOTIFICATIONS.ACCOUNT.USER_UPDATED';

  constructor(
    private actions$: Actions,
    private accountService: AccountService,
    private userService: UserService,
    private asyncJobService: AsyncJobService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  private onNotify(user, message) {
    this.notificationService.message({
      translationToken: message,
      interpolateParams: { username: user.username }
    });
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
