import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators/tap';
import { mergeMap } from 'rxjs/operators/mergeMap';

import { AuthActionTypes, IdleLogout, LogoutComplete } from './auth.actions';
import { RouterUtilsService } from '../../shared/services/router-utils.service';
import { AuthService } from '../../shared/services/auth.service';
import { IdleMonitorActions, UserTagsActions } from '../../root-store/';
import { SystemTagsService } from '../../core/services';

@Injectable()
export class AuthEffects {
  @Effect({ dispatch: false })
  idleLogout$: Observable<Action> = this.actions$.pipe(
    ofType<IdleLogout>(AuthActionTypes.IdleLogout),
    tap(() => this.router.navigate(['/logout'], this.routerUtilsService.getRedirectionQueryParams())),
  );

  @Effect()
  logoutSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<LogoutComplete>(AuthActionTypes.LogoutComplete),
    mergeMap(() => [
      new IdleMonitorActions.StopIdleMonitor(),
      new UserTagsActions.SetDefaultUserTagsDueToLogout({ tags: this.systemTagsService.getDefaultUserTags()})
    ])
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private routerUtilsService: RouterUtilsService,
    private systemTagsService: SystemTagsService
  ) {
  }
}
