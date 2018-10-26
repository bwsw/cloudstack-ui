import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Keepalive } from '@ng-idle/keepalive';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Observable } from 'rxjs';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';

import { State } from '../state';
import {
  IdleMonitorActionTypes,
  RefreshSessionRequest,
  StopIdleMonitor,
  UpdateIdleMonitorTimeout,
} from './idle-monitor.actions';
import { IdleLogout } from '../../auth/store/auth.actions';
import { AuthService } from '../../shared/services/auth.service';
import { TagService } from '../../shared/services/tags/tag.service';
import { UserTagsSelectors } from '../server-data/user-tags';
import { configSelectors } from '../config';

@Injectable()
export class IdleEffects {
  @Effect({ dispatch: false })
  startIdleMonitor$: Observable<[Action, number, number]> = this.actions$.pipe(
    ofType(IdleMonitorActionTypes.StartIdleMonitor),
    withLatestFrom(
      this.store.pipe(select(UserTagsSelectors.getSessionTimeout)),
      this.store.pipe(select(configSelectors.get('sessionRefreshInterval'))),
    ),
    // timeout = 0 - disable idle monitor
    filter(([action, timeout, refreshInterval]) => timeout > 0),
    tap(([action, timeout, refreshInterval]) => this.startIdleMonitor(timeout, refreshInterval)),
  );

  @Effect({ dispatch: false })
  updateIdleMonitorTimeout$: Observable<{
    timeout: number;
    refreshInterval: number;
  }> = this.actions$.pipe(
    ofType<UpdateIdleMonitorTimeout>(IdleMonitorActionTypes.UpdateIdleMonitorTimeout),
    withLatestFrom(this.store.pipe(select(configSelectors.get('sessionRefreshInterval')))),
    map(([action, refreshInterval]) => ({ refreshInterval, timeout: action.payload.timeout })),
    tap(({ timeout, refreshInterval }) => {
      if (timeout > 0) {
        this.startIdleMonitor(timeout, refreshInterval);
      } else {
        this.stopIdleMonitor();
      }
    }),
  );

  @Effect({ dispatch: false })
  stopIdleMonitor$: Observable<Action> = this.actions$.pipe(
    ofType<StopIdleMonitor>(IdleMonitorActionTypes.StopIdleMonitor),
    tap(() => this.stopIdleMonitor()),
  );

  @Effect({ dispatch: false })
  refreshSessionRequest$: Observable<Action> = this.actions$.pipe(
    ofType<RefreshSessionRequest>(IdleMonitorActionTypes.RefreshSessionRequest),
    tap(() => this.tagService.getList({ resourceid: this.authService.user.userid }).subscribe()),
  );

  constructor(
    private actions$: Actions,
    private idle: Idle,
    private keepalive: Keepalive,
    private store: Store<State>,
    private authService: AuthService,
    private tagService: TagService,
  ) {
    this.setupPersistentIdleServiceParameters();
  }

  private startIdleMonitor(sessionTimeout: number, sessionRefreshInterval: number) {
    this.idle.setIdle(sessionTimeout * 60);
    // The Session Refresh Interval can't be moved to setupPersistentIdleServiceParameters() function
    // because the ConfigService service will not have any config values when this service is initialized
    this.keepalive.interval(sessionRefreshInterval);

    this.idle.watch();
  }

  private stopIdleMonitor() {
    this.idle.stop();
  }

  private setupPersistentIdleServiceParameters() {
    this.idle.setTimeout(0);
    this.idle.setAutoResume(2);
    // Default interrupt source includes:
    // mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleStart.subscribe(() => this.store.dispatch(new IdleLogout()));
    this.keepalive.onPing.subscribe(() => this.store.dispatch(new RefreshSessionRequest()));
  }
}
