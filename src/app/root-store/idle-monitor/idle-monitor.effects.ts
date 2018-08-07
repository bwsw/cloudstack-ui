import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Keepalive } from '@ng-idle/keepalive';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';

import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators/tap';
import { map } from 'rxjs/operators/map';
import { filter } from 'rxjs/operators/filter';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';

import { State } from '../state';
import { ConfigService } from '../../core/services';
import {
  IdleMonitorActionTypes,
  RefreshSessionRequest,
  StopIdleMonitor,
  UpdateIdleMonitorTimeout
} from './idle-monitor.actions';
import { IdleLogout } from '../../auth/store/auth.actions';
import { AuthService } from '../../shared/services/auth.service';
import { TagService } from '../../shared/services/tags/tag.service';
import { getSessionTimeout } from '../server-data/user-tags/user-tags.selectors';


@Injectable()
export class IdleEffects {
  @Effect({ dispatch: false })
  startIdleMonitor$: Observable<[Action, number]> = this.actions$.pipe(
    ofType(IdleMonitorActionTypes.StartIdleMonitor),
    withLatestFrom(this.store.select(getSessionTimeout)),
    filter(([action, sessionTimeout]) => sessionTimeout > 0), // timeout = 0 - disable idle monitor
    tap(([action, sessionTimeout]) => this.startIdleMonitor(sessionTimeout))
  );

  @Effect({ dispatch: false })
  updateIdleMonitorTimeout$: Observable<number> = this.actions$.pipe(
    ofType<UpdateIdleMonitorTimeout>(IdleMonitorActionTypes.UpdateIdleMonitorTimeout),
    map(action => action.payload.timeout),
    tap((timeout) => {
      if (timeout > 0) {
        this.startIdleMonitor(timeout)
      } else {
        this.stopIdleMonitor()
      }
    })
  );

  @Effect({ dispatch: false })
  stopIdleMonitor$: Observable<Action> = this.actions$.pipe(
    ofType<StopIdleMonitor>(IdleMonitorActionTypes.StopIdleMonitor),
    tap(() => this.stopIdleMonitor())
  );

  @Effect({ dispatch: false })
  refreshSessionRequest$: Observable<Action> = this.actions$.pipe(
    ofType<RefreshSessionRequest>(IdleMonitorActionTypes.RefreshSessionRequest),
    tap(() => this.tagService.getList({ resourceid: this.authService.user.userid }))
  );

  constructor(
    private actions$: Actions,
    private idle: Idle,
    private keepalive: Keepalive,
    private store: Store<State>,
    private authService: AuthService,
    private tagService: TagService,
    private configService: ConfigService,
  ) {
    this.setupPersistentIdleServiceParameters();
  }

  private startIdleMonitor(sessionTimeout: number) {
    this.idle.setIdle(sessionTimeout * 60);
    // The Session Refresh Interval can't be moved to setupPersistentIdleServiceParameters() function
    // because the ConfigService service will not have any config values when this service is initialized
    const sessionRefreshInterval = this.configService.get('sessionRefreshInterval');
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
