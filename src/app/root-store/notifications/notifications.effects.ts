import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { SnackBarService } from '../../core/services/snack-bar.service';
import { UserTagsActionTypes } from '../server-data/user-tags/user-tags.actions';

@Injectable()
export class NotificationsEffects {
  @Effect({ dispatch: false })
  loadingDataError$: Observable<Action> = this.actions$.pipe(
    ofType(UserTagsActionTypes.LoadUserTagsError),
    tap(() => {
      const message = 'NOTIFICATIONS.ERROR_WHILE_LOADING_DATA';
      const actionMessage = 'COMMON.REFRESH';
      this.snackBarService
        .open(message, actionMessage, { duration: 10000 })
        .pipe(switchMap(snackBarRef => snackBarRef.onAction()))
        .subscribe(() => location.reload());
    }),
  );

  constructor(private actions$: Actions, private snackBarService: SnackBarService) {}
}
