import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { interval, Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { VmLogsService } from '../services/vm-logs.service';
import * as vmLogsActions from './vm-logs.actions';
import * as fromVmLogs from './vm-logs.reducers';
import { State } from '../../reducers';
import { ScrollVmLogsList } from '../models/scroll-vm-logs-list';
import { takeUntil } from 'rxjs/internal/operators';
import { VmLog } from '../models/vm-log.model';
import { scrollVmLogsRequestParams } from './scroll-vm-logs-request-params.selector';
import { VmLogsScrollService } from '../services/vm-logs-scroll.service';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';


@Injectable()
export class VmLogsEffects {
  @Effect()
  loadVmLogs$: Observable<Action> = this.actions$.pipe(
    ofType(vmLogsActions.LOAD_VM_LOGS_REQUEST),
    withLatestFrom(this.store.pipe(select(fromVmLogs.loadVmLogsRequestParams))),
    switchMap(([action, loadVmLogsRequestParams]) => {
      return this.vmLogsService.getList(loadVmLogsRequestParams).pipe(
        map((vmLogs: VmLog[]) => {
          return new vmLogsActions.LoadVmLogsResponse(vmLogs);
        }),
        catchError(() => of(new vmLogsActions.LoadVmLogsResponse([]))));
    }));

  @Effect()
  loadVmLogsScroll$: Observable<Action> = this.actions$.pipe(
    ofType(vmLogsActions.LOAD_VM_LOGS_SCROLL_REQUEST),
    withLatestFrom(this.store.pipe(select(fromVmLogs.loadVmLogsScrollRequestParams))),
    switchMap(([action, params]) => {
      return this.vmLogsService.getScrollList(params).pipe(
        map((vmLogs: ScrollVmLogsList) => {
          return new vmLogsActions.LoadVmLogsScrollResponse(vmLogs);
        }),
        catchError(() => of(new vmLogsActions.LoadVmLogsScrollResponse({
          scrollid: null,
          list: []
        }))));
    }));

  @Effect()
  scrollVmLogsStart$: Observable<Action> = this.actions$.pipe(
    ofType(vmLogsActions.SCROLL_VM_LOGS),
    map(() => new vmLogsActions.LoadVmLogsScrollRequest()),
  );

  @Effect()
  stopScrollVmLogs$: Observable<Action> = this.actions$.pipe(
    ofType(
      vmLogsActions.SCROLL_VM_LOGS_ERROR,
      ROUTER_NAVIGATION
    ),
    map(() => new vmLogsActions.StopScrollVmLogs())
  );

  @Effect()
  requestScrollBatch$: Observable<Action> = this.actions$.pipe(
    ofType(vmLogsActions.LOAD_VM_LOGS_SCROLL_RESPONSE),
    switchMap(() =>
      interval(1000).pipe(
        takeUntil(this.actions$.pipe(ofType(vmLogsActions.STOP_SCROLL_VM_LOGS))),
        map(() => new vmLogsActions.ScrollVmLogsRequest())
      )
    ),
  );

  @Effect()
  scrollVmLogs$: Observable<Action> = this.actions$.pipe(
    ofType(vmLogsActions.SCROLL_VM_LOGS_REQUEST),
    withLatestFrom(this.store.pipe(select(scrollVmLogsRequestParams))),
    switchMap(([action, params]) => {
      return this.vmLogsService.scroll(params).pipe(
        map((vmLogs: ScrollVmLogsList) => {
          return new vmLogsActions.ScrollVmLogsResponse(vmLogs);
        }),
        catchError(error => of(new vmLogsActions.ScrollVmLogsError(error)))
      );
    })
  );

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private vmLogsService: VmLogsService,
  ) {
  }
}
