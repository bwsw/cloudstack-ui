import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as authActions from './auth.actions';
import { Account } from '../../../shared/models';
import { AccountService } from '../../../shared/services/account.service';

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

  constructor(private actions$: Actions, private accountService: AccountService) {}
}
