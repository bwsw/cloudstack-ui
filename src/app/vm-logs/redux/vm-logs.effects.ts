import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { VmLogsService } from '../services/vm-logs.service';
import { VmLog } from '../models/vm-log.model';
import * as vmLogsActions from './vm-logs.actions';
import { State } from '../../reducers';
import { VmLogFilesService } from '../services/vm-log-files.service';
import { VmLogFile } from '../models/vm-log-file.model';
import { loadVmLogsRequestParams } from './selectors/load-vm-logs-request-params.selector';
import { loadVmLogFilesRequestParams } from './selectors/load-vm-log-files-request-params.selector';

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

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private vmLogsService: VmLogsService,
    private vmLogFilesService: VmLogFilesService,
  ) {}
}
