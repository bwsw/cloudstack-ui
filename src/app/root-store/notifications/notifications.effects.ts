import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators/tap';

import { SnackBarService } from '../../core/services';
import { UserTagsActionTypes } from '../server-data/user-tags/user-tags.actions';

@Injectable()
export class NotificationsEffects {
  @Effect({ dispatch: false })
  loadingDataError$: Observable<Action> = this.actions$.pipe(
    ofType(
      UserTagsActionTypes.LoadUserTagsError
    ),
    tap(() => {
      const message = 'NOTIFICATIONS.ERROR_WHILE_LOADING_DATA';
      const actionMessage = 'COMMON.REFRESH';
      this.snackBarService.open(message, actionMessage, { duration: 10000 })
        .switchMap(snackBarRef => snackBarRef.onAction())
        .subscribe(() => location.reload())
    })
  );

  constructor(private actions$: Actions, private snackBarService: SnackBarService) {
  }
}
