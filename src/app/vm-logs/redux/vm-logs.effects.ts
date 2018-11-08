import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { concat, Observable, of, timer } from 'rxjs';
import { catchError, map, tap, switchMap, withLatestFrom } from 'rxjs/operators';
import { VmLogsService } from '../services/vm-logs.service';
import { VmLog } from '../models/vm-log.model';
import { filterSelectedAccountIds, filterSelectedVmId } from './vm-logs-vm.reducers';
import * as vmLogsActions from './vm-logs.actions';
import { State } from '../../reducers';
import { VmLogFilesService } from '../services/vm-log-files.service';
import { VmLogFile } from '../models/vm-log-file.model';
import { loadVmLogsRequestParams } from './selectors/load-vm-logs-request-params.selector';
import { loadVmLogFilesRequestParams } from './selectors/load-vm-log-files-request-params.selector';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { filter, takeUntil } from 'rxjs/internal/operators';
import { loadAutoUpdateVmLogsRequestParams } from './selectors/load-auto-update-vm-logs-request-params.selector';
import moment = require('moment');
import * as fromVmLogsAutoUpdate from './vm-logs-auto-update.reducers';
import { Utils } from '../../shared/services/utils/utils.service';
import { Router } from '@angular/router';
import { RouterNavigationAction } from '@ngrx/router-store/src/router_store_module';
import { filters, getVmLogsState } from './vm-logs.reducers';

@Injectable()
export class VmLogsEffects {
  @Effect()
  loadVmLogs$: Observable<Action> = this.actions$.pipe(
    ofType(vmLogsActions.VmLogsActionTypes.LOAD_VM_LOGS_REQUEST),
    withLatestFrom(this.store.pipe(select(loadVmLogsRequestParams))),
    switchMap(([action, params]) => {
      return this.vmLogsService.getList(params).pipe(
        map((vmLogs: VmLog[]) => {
          return new vmLogsActions.LoadVmLogsResponse(vmLogs);
        }),
        catchError(() => of(new vmLogsActions.LoadVmLogsResponse([]))),
      );
    }),
  );

  @Effect()
  loadVmLogFiles$: Observable<Action> = this.actions$.pipe(
    ofType(vmLogsActions.VmLogsActionTypes.LOAD_VM_LOG_FILES_REQUEST),
    withLatestFrom(this.store.pipe(select(loadVmLogFilesRequestParams))),
    switchMap(([action, params]) => {
      return this.vmLogFilesService.getList(params).pipe(
        map((vmLogFiles: VmLogFile[]) => {
          return new vmLogsActions.LoadVmLogFilesResponse(vmLogFiles);
        }),
        catchError(() => of(new vmLogsActions.LoadVmLogFilesResponse([]))),
      );
    }),
  );

  @Effect()
  loadVmLogFilesOnVmChange$: Observable<Action> = this.actions$.pipe(
    ofType(vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_VM_ID),
    switchMap(() => of(new vmLogsActions.LoadVmLogFilesRequest())),
  );

  @Effect()
  resetLogFileOnVmChange$: Observable<Action> = this.actions$.pipe(
    ofType(vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_VM_ID),
    switchMap(() => of(new vmLogsActions.VmLogsUpdateLogFile(null))),
  );

  @Effect()
  stopAutoUpdateOnRouterNavigation$: Observable<Action> = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION),
    withLatestFrom(this.store.pipe(select(fromVmLogsAutoUpdate.selectIsAutoUpdateEnabled))),
    filter(([action, isAutoUpdateEnabled]: [RouterNavigationAction, boolean]) => {
      if (!isAutoUpdateEnabled) {
        return false;
      }

      const currentUrl = Utils.getRouteWithoutQueryParams(this.router.routerState);
      const nextUrl = Utils.getRouteWithoutQueryParams({
        snapshot: {
          url: action.payload.routerState.url || '',
        },
      });

      return currentUrl !== nextUrl;
    }),
    map(() => new vmLogsActions.DisableAutoUpdate()),
  );

  @Effect()
  stopAutoUpdateOnShowLogs$: Observable<Action> = this.actions$.pipe(
    ofType(vmLogsActions.VmLogsActionTypes.LOAD_VM_LOGS_REQUEST),
    map(() => new vmLogsActions.DisableAutoUpdate()),
  );

  @Effect()
  loadAutoUpdateVmLogs$: Observable<Action> = this.actions$.pipe(
    ofType(vmLogsActions.VmLogsActionTypes.LOAD_AUTO_UPDATE_VM_LOGS_REQUEST),
    withLatestFrom(this.store.pipe(select(loadAutoUpdateVmLogsRequestParams))),
    switchMap(([action, params]) => {
      return this.vmLogsService.getList(params).pipe(
        map((vmLogs: VmLog[]) => {
          return new vmLogsActions.LoadAutoUpdateVmLogsResponse(vmLogs);
        }),
        catchError(error => of(new vmLogsActions.LoadAutoUpdateVmLogsError(error))),
      );
    }),
  );

  @Effect()
  enableAutoUpdate$: Observable<Action> = this.actions$.pipe(
    ofType(vmLogsActions.VmLogsActionTypes.ENABLE_AUTO_UPDATE),
    switchMap(() =>
      timer(0, 10000).pipe(
        takeUntil(this.actions$.pipe(ofType(vmLogsActions.VmLogsActionTypes.DISABLE_AUTO_UPDATE))),
        switchMap(() => {
          const startDate = moment()
            .add(-1, 'minutes')
            .toObject();
          const endDate = moment().toObject();

          return concat(
            of(new vmLogsActions.SetAutoUpdateStartDate(startDate)),
            of(new vmLogsActions.SetAutoUpdateEndDate(endDate)),
            of(new vmLogsActions.LoadAutoUpdateVmLogsRequest()),
          );
        }),
      ),
    ),
  );

  @Effect()
  resetScroll$: Observable<Action> = this.actions$.pipe(
    ofType(
      vmLogsActions.VmLogsActionTypes.ENABLE_AUTO_UPDATE,
      vmLogsActions.VmLogsActionTypes.DISABLE_AUTO_UPDATE,
      vmLogsActions.VmLogsActionTypes.LOAD_VM_LOGS_REQUEST,
    ),
    map(() => new vmLogsActions.ResetVmLogsScroll()),
  );

  @Effect({ dispatch: false })
  storeFilterInTags$ = this.actions$.pipe(
    ofType(
      vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_SEARCH,
      vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_START_DATE_TIME,
      vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_START_DATE,
      vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_START_TIME,
      vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_END_DATE_TIME,
      vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_END_DATE,
      vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_END_TIME,
      vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_ACCOUNT_IDS,
      vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_NEWEST_FIRST,
      vmLogsActions.VmLogsActionTypes.VM_LOGS_TOGGLE_NEWEST_FIRST,
      vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_VM_ID,
      vmLogsActions.VmLogsActionTypes.VM_LOGS_UPDATE_LOG_FILE,
    ),
    withLatestFrom(
      this.store.pipe(select(filters)),
      this.store.pipe(select(filterSelectedVmId)),
      this.store.pipe(select(filterSelectedAccountIds)),
    ),
    tap(a => {
      debugger;
      console.log(a);
    }),
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<State>,
    private vmLogsService: VmLogsService,
    private vmLogFilesService: VmLogFilesService,
  ) {}
}
