import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { Account } from '../../../shared/models';
import { AccountService } from '../../../shared/services/account.service';
import { SnackBarService } from '../../../core/services';
import { UserService } from '../../../shared/services/user.service';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';

import * as vmActions from '../../vm/redux/vm.actions';
import * as volumeActions from '../../volumes/redux/volumes.actions';
import * as snapshotActions from '../../snapshots/redux/snapshot.actions';
import * as accountActions from './accounts.actions';

@Injectable()
export class AccountsEffects {
  @Effect()
  loadAccounts$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.LOAD_ACCOUNTS_REQUEST),
    switchMap((action: accountActions.LoadAccountsRequest) => {
      return this.accountService.getList(action.payload).pipe(
        map((accounts: Account[]) => {
          return new accountActions.LoadAccountsResponse(accounts);
        }),
        catchError(() => of(new accountActions.LoadAccountsResponse([]))),
      );
    }),
  );

  @Effect()
  updateAccounts$: Observable<Action> = this.actions$.pipe(
    ofType(
      vmActions.VM_DEPLOYMENT_REQUEST_SUCCESS,
      vmActions.EXPUNGE_VM_SUCCESS,
      volumeActions.VOLUME_DELETE_SUCCESS,
      volumeActions.VOLUME_CREATE_SUCCESS,
      volumeActions.RESIZE_VOLUME_SUCCESS,
      snapshotActions.ADD_SNAPSHOT_SUCCESS,
      snapshotActions.DELETE_SNAPSHOT_SUCCESS,
    ),
    map(() => {
      return new accountActions.LoadAccountsRequest();
    }),
  );

  @Effect()
  disableAccount$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.DISABLE_ACCOUNT),
    mergeMap((action: accountActions.DisableAccountRequest) => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.ACCOUNT.DISABLE_IN_PROGRESS',
      );
      return this.accountService.disableAccount(action.payload).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.ACCOUNT.DISABLE_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        }),
        map(updatedAccount => new accountActions.UpdateAccount(updatedAccount)),
        catchError((error: Error) => {
          const message = 'NOTIFICATIONS.ACCOUNT.DISABLE_FAILED';
          this.dialogService.showNotificationsOnFail(error, message, notificationId);
          return of(new accountActions.AccountUpdateError(error));
        }),
      );
    }),
  );

  @Effect()
  enableAccount$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.ENABLE_ACCOUNT),
    mergeMap((action: accountActions.EnableAccountRequest) => {
      return this.accountService.enableAccount(action.payload).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.ACCOUNT.ENABLE_DONE';
          this.showNotificationsOnFinish(message);
        }),
        map(updatedAccount => new accountActions.UpdateAccount(updatedAccount)),
        catchError((error: Error) => {
          this.dialogService.showNotificationsOnFail(error);
          return of(new accountActions.AccountUpdateError(error));
        }),
      );
    }),
  );

  @Effect()
  deleteAccount$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.DELETE_ACCOUNT),
    mergeMap((action: accountActions.DeleteAccountRequest) => {
      const notificationId = this.jobsNotificationService.add(
        'NOTIFICATIONS.ACCOUNT.DELETION_IN_PROGRESS',
      );
      return this.accountService.removeAccount(action.payload).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.ACCOUNT.DELETION_DONE';
          this.showNotificationsOnFinish(message, notificationId);
        }),
        map(() => new accountActions.DeleteSuccess(action.payload)),
        catchError((error: Error) => {
          const message = 'NOTIFICATIONS.ACCOUNT.DELETION_FAILED';
          this.dialogService.showNotificationsOnFail(error, message, notificationId);
          return of(new accountActions.AccountUpdateError(error));
        }),
      );
    }),
  );

  @Effect()
  createAccount$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.CREATE_ACCOUNT),
    mergeMap((action: accountActions.CreateAccount) => {
      return this.accountService.create(action.payload).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.ACCOUNT.CREATION_DONE';
          this.showNotificationsOnFinish(message);
        }),
        map(createdAccount => new accountActions.CreateSuccess(createdAccount)),
        catchError((error: Error) => {
          this.dialogService.showNotificationsOnFail(error);
          return of(new accountActions.CreateError(error));
        }),
      );
    }),
  );

  @Effect({ dispatch: false })
  accountCreateSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.ACCOUNT_CREATE_SUCCESS),
    tap((action: accountActions.CreateSuccess) => {
      this.dialog.closeAll();
    }),
  );

  @Effect({ dispatch: false })
  deleteSuccessNavigate$: Observable<Account> = this.actions$.pipe(
    ofType(accountActions.ACCOUNT_DELETE_SUCCESS),
    map((action: accountActions.DeleteSuccess) => action.payload),
    filter((account: Account) => {
      return this.router.isActive(`/accounts/${account.id}`, false);
    }),
    tap(() => {
      this.router.navigate(['./accounts'], {
        queryParamsHandling: 'preserve',
      });
    }),
  );

  @Effect()
  userDelete$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.ACCOUNT_USER_DELETE),
    mergeMap((action: accountActions.AccountUserDelete) =>
      this.userService.removeUser(action.payload).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.ACCOUNT.USER.DELETE_DONE';
          this.showNotificationsOnFinish(message);
        }),
        map(() => new accountActions.AccountUserDeleteSuccess(action.payload)),
        catchError(error => {
          this.dialogService.showNotificationsOnFail(error);
          return of(new accountActions.AccountUpdateError(error));
        }),
      ),
    ),
  );

  @Effect()
  userCreate$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.ACCOUNT_USER_CREATE),
    mergeMap((action: accountActions.AccountUserCreate) =>
      this.userService.createUser(action.payload).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.ACCOUNT.USER.CREATION_DONE';
          this.showNotificationsOnFinish(message);
        }),
        map(user => new accountActions.AccountUserCreateSuccess(user)),
        catchError(error => {
          this.dialogService.showNotificationsOnFail(error);
          return of(new accountActions.AccountUpdateError(error));
        }),
      ),
    ),
  );

  @Effect({ dispatch: false })
  userCreateSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.ACCOUNT_USER_CREATE_SUCCESS),
    tap(() => {
      this.dialog.closeAll();
    }),
  );

  @Effect()
  userUpdate$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.ACCOUNT_USER_UPDATE),
    mergeMap((action: accountActions.AccountUserUpdate) =>
      this.userService.updateUser(action.payload).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.ACCOUNT.USER.UPDATE_DONE';
          this.showNotificationsOnFinish(message);
        }),
        map(user => new accountActions.AccountUserUpdateSuccess(user)),
        catchError(error => {
          this.dialogService.showNotificationsOnFail(error);
          return of(new accountActions.AccountUpdateError(error));
        }),
      ),
    ),
  );

  @Effect()
  userGenerateKeys$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.ACCOUNT_USER_GENERATE_KEYS),
    mergeMap((action: accountActions.AccountUserGenerateKey) =>
      this.userService.registerKeys(action.payload.id).pipe(
        tap(() => {
          const message = 'NOTIFICATIONS.ACCOUNT.USER.GENERATE_KEYS_DONE';
          this.showNotificationsOnFinish(message);
        }),
        map(
          res =>
            new accountActions.AccountLoadUserKeysSuccess({
              user: action.payload,
              userKeys: res,
            }),
        ),
        catchError(error => {
          this.dialogService.showNotificationsOnFail(error);
          return of(new accountActions.AccountUpdateError(error));
        }),
      ),
    ),
  );

  @Effect()
  userLoadKeys$: Observable<Action> = this.actions$.pipe(
    ofType(accountActions.ACCOUNT_LOAD_USER_KEYS),
    switchMap((action: accountActions.AccountLoadUserKeys) =>
      this.userService.getUserKeys(action.payload.id).pipe(
        map(
          res =>
            new accountActions.AccountLoadUserKeysSuccess({
              user: action.payload,
              userKeys: res,
            }),
        ),
        catchError(error => of(new accountActions.AccountUpdateError(error))),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private accountService: AccountService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog,
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
    private jobsNotificationService: JobsNotificationService,
  ) {}

  private showNotificationsOnFinish(message: string, jobNotificationId?: string) {
    if (jobNotificationId) {
      this.jobsNotificationService.finish({
        message,
        id: jobNotificationId,
      });
    }
    this.snackBarService.open(message).subscribe();
  }
}
