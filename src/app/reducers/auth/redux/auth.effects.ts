import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import * as authActions from './auth.actions';
import { Account } from '../../../shared/models';
import { AccountService } from '../../../shared/services/account.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';

@Injectable()
export class UserAccountEffects {
  @Effect()
  loadUserAccount$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.LOAD_USER_ACCOUNT_REQUEST),
    switchMap((action: authActions.LoadUserAccountRequest) => {
      return this.accountService.getAccount(action.payload).pipe(
        map((account: Account) => {
          return new authActions.LoadUserAccountResponse(account);
        }),
        catchError(() => of(new authActions.LoadUserAccountResponse({}))),
      );
    }),
  );

  @Effect({ dispatch: false })
  loadUserAccountResponse$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.LOAD_USER_ACCOUNT_RESPONSE),
    tap((action: authActions.LoadUserAccountResponse) => {
      this.storage.write('userAccount', JSON.stringify(action.payload));
    }),
  );

  constructor(
    private actions$: Actions,
    private accountService: AccountService,
    private storage: LocalStorageService,
  ) {}
}
