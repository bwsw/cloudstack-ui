import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { VmLogsService } from '../services/vm-logs.service';
import { VmLog } from '../models/vm-log.model';
import * as vmLogsActions from './vm-logs.actions';

@Injectable()
export class VmLogsEffects {
  @Effect()
  loadVmLogs$: Observable<Action> = this.actions$.pipe(
    ofType(vmLogsActions.LOAD_VM_LOGS_REQUEST),
    switchMap((action: vmLogsActions.LoadVmLogsRequest) => {
      return this.vmLogsService.getList(action.payload).pipe(
        map((vmLogs: VmLog[]) => {
          return new vmLogsActions.LoadVmLogsResponse(vmLogs);
        }),
        catchError(() => of(new vmLogsActions.LoadVmLogsResponse([]))));
    }));

  constructor(
    private actions$: Actions,
    private vmLogsService: VmLogsService,
  ) {
  }
}
