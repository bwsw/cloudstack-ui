import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { concat, Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { VmLogsService } from '../services/vm-logs.service';
import { VmLog } from '../models/vm-log.model';
import * as vmLogsActions from './vm-logs.actions';
import { State } from '../../reducers';
import { VmLogFilesService } from '../services/vm-log-files.service';
import { VmLogFile } from '../models/vm-log-file.model';
import { loadVmLogsRequestParams } from './selectors/load-vm-logs-request-params.selector';
import { loadVmLogFilesRequestParams } from './selectors/load-vm-log-files-request-params.selector';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { filter, takeUntil } from 'rxjs/internal/operators';
import { loadAutoUpdateVmLogsRequestParams } from './selectors/load-auto-update-vm-logs-request-params.selector';
import * as fromVmLogsAutoUpdate from './vm-logs-auto-update.reducers';
import { Utils } from '../../shared/services/utils/utils.service';
import { Router } from '@angular/router';
import { RouterNavigationAction } from '@ngrx/router-store/src/router_store_module';
import { configSelectors, UserTagsSelectors } from '../../root-store';
import { UserTagsActionTypes } from '../../root-store/server-data/user-tags/user-tags.actions';
import * as assign from 'lodash/assign';
import { getVmLogsFiltersDefaultValues, parseVmLogsFilters } from '../vm-logs-filters';
import {
  filterNewestFirst,
  filters as vmLogsFilters,
  filterSelectedLogFile,
  selectAll as selectVmLogs,
} from './vm-logs.reducers';
import removeNullsAndEmptyArrays from '../remove-nulls-and-empty-arrays';
import { selectAll as logFiles } from './vm-log-files.reducers';
import moment = require('moment');

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
    ofType(vmLogsActions.VmLogsActionTypes.LOAD_VM_LOG_FILES_RESPONSE),
    withLatestFrom(
      this.store.pipe(select(filterSelectedLogFile)),
      this.store.pipe(select(logFiles)),
    ),
    map(([_, logFile, currentLogFiles]) => {
      if (!currentLogFiles.find(lf => lf.file === logFile)) {
        return new vmLogsActions.VmLogsUpdateLogFile(null);
      }

      return new vmLogsActions.VmLogsUpdateLogFile(logFile);
    }),
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
  updateAutoUpdateVmLogs$: Observable<Action> = this.actions$.pipe(
    ofType(vmLogsActions.VmLogsActionTypes.LOAD_AUTO_UPDATE_VM_LOGS_RESPONSE),
    withLatestFrom(
      this.store.pipe(select(selectVmLogs)),
      this.store.pipe(select(UserTagsSelectors.getVmLogsShowLastMinutes)),
      this.store.pipe(select(filterNewestFirst)),
    ),
    map(([_, logs, minutes, newestFirst]) => {
      const nowTime = moment();
      const filteredLogs = logs.filter(log => {
        const logTime = moment(log.timestamp);
        const diff = nowTime.diff(logTime);
        const diffInMinutes = moment.duration(diff).asMinutes();
        return diffInMinutes <= minutes;
      });
      const sortedLogs = filteredLogs.sort((a, b) => {
        if (newestFirst) {
          return b.timestamp.localeCompare(a.timestamp);
        }

        return a.timestamp.localeCompare(b.timestamp);
      });

      return new vmLogsActions.UpdateAutoUpdateVmLogs(sortedLogs);
    }),
  );

  @Effect()
  enableAutoUpdate$: Observable<Action> = this.actions$.pipe(
    ofType(vmLogsActions.VmLogsActionTypes.ENABLE_AUTO_UPDATE),
    withLatestFrom(
      this.store.pipe(select(UserTagsSelectors.getVmLogsShowLastMinutes)),
      this.store.pipe(select(configSelectors.get('vmLogs'))),
    ),
    switchMap(([_, minutes, { autoUpdateRefreshFrequency, autoUpdateRequestedInterval }]) => {
      const refreshFrequency = autoUpdateRefreshFrequency * 1000;
      const firstStartDate = moment()
        .add(-minutes, 'minutes')
        .toObject();
      const firstEndDate = moment().toObject();

      return concat(
        of(
          new vmLogsActions.SetAutoUpdateStartDate(firstStartDate),
          new vmLogsActions.SetAutoUpdateEndDate(firstEndDate),
          new vmLogsActions.LoadAutoUpdateVmLogsRequest(),
        ),
        timer(refreshFrequency, refreshFrequency).pipe(
          takeUntil(
            this.actions$.pipe(ofType(vmLogsActions.VmLogsActionTypes.DISABLE_AUTO_UPDATE)),
          ),
          switchMap(() => {
            const startDate = moment()
              .add(-autoUpdateRequestedInterval, 'seconds')
              .toObject();
            const endDate = moment().toObject();

            return of(
              new vmLogsActions.SetAutoUpdateStartDate(startDate),
              new vmLogsActions.SetAutoUpdateEndDate(endDate),
              new vmLogsActions.LoadAutoUpdateVmLogsRequest(),
            );
          }),
        ),
      );
    }),
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

  @Effect()
  setFiltersFromUserTags$: Observable<Action> = this.actions$.pipe(
    ofType(UserTagsActionTypes.LoadUserTagsSuccess),
    withLatestFrom(
      this.store.pipe(select(UserTagsSelectors.getVmLogsFilters)),
      this.store.pipe(select(vmLogsFilters)),
    ),
    map(([_, tagFilters, currentFilters]) => {
      const defaultFilters = getVmLogsFiltersDefaultValues();
      const parsedTagFilters = parseVmLogsFilters(tagFilters);
      const nonNullCurrentFilters = removeNullsAndEmptyArrays(currentFilters);

      const mergedParams = assign(defaultFilters, parsedTagFilters, nonNullCurrentFilters);

      return new vmLogsActions.UpdateFilters(mergedParams);
    }),
  );

  @Effect()
  updateVmLogFilters$: Observable<Action> = this.actions$.pipe(
    ofType<vmLogsActions.UpdateFilters>(vmLogsActions.VmLogsActionTypes.UPDATE_FILTERS),
    map(action => action.payload),
    switchMap(params => {
      const paramsActionsMap = {
        vm: vmLogsActions.VmLogsUpdateVmId,
        search: vmLogsActions.VmLogsUpdateSearch,
        accounts: vmLogsActions.VmLogsUpdateAccountIds,
        newestFirst: vmLogsActions.VmLogsUpdateNewestFirst,
        logFile: vmLogsActions.VmLogsUpdateLogFile,
        startDate: vmLogsActions.VmLogsUpdateStartDateTime,
        endDate: vmLogsActions.VmLogsUpdateEndDateTime,
      };

      const dispatchedActions = Object.keys(paramsActionsMap).reduce((acc, param) => {
        if (params.hasOwnProperty(param)) {
          const action = paramsActionsMap[param];
          const value = params[param];

          return [...acc, new action(value)];
        }

        return acc;
      }, []);

      return of(...dispatchedActions);
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
