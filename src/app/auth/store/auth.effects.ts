import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { AuthActionTypes, IdleLogout, LogoutComplete } from './auth.actions';
import { RouterUtilsService } from '../../shared/services/router-utils.service';
import { configSelectors, IdleMonitorActions, State, UserTagsActions } from '../../root-store/';

@Injectable()
export class AuthEffects {
  @Effect({ dispatch: false })
  idleLogout$: Observable<Action> = this.actions$.pipe(
    ofType<IdleLogout>(AuthActionTypes.IdleLogout),
    tap(() =>
      this.router.navigate(['/logout'], this.routerUtilsService.getRedirectionQueryParams()),
    ),
  );

  @Effect()
  logoutSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<LogoutComplete>(AuthActionTypes.LogoutComplete),
    withLatestFrom(this.store.pipe(select(configSelectors.getDefaultUserTags))),
    mergeMap(([action, tags]) => [
      new IdleMonitorActions.StopIdleMonitor(),
      new UserTagsActions.SetDefaultUserTagsDueToLogout({ tags }),
    ]),
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private routerUtilsService: RouterUtilsService,
    private store: Store<State>,
  ) {}
}
