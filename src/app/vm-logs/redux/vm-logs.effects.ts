import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { VmLogsService } from '../services/vm-logs.service';
import { VmLog } from '../models/vm-log.model';
import * as vmLogsActions from './vm-logs.actions';
import * as fromVmLogs from './vm-logs.reducers';
import { State } from '../../reducers';


@Injectable()
export class VmLogsEffects {
  @Effect()
  loadVmLogs$: Observable<Action> = this.actions$.pipe(
    ofType(vmLogsActions.LOAD_VM_LOGS_REQUEST),
    withLatestFrom(this.store.pipe(select(fromVmLogs.filterSelectedVmId))),
    switchMap(([action, id]) => {
      return this.vmLogsService.getList({ id }).pipe(
        map((vmLogs: VmLog[]) => {
          return new vmLogsActions.LoadVmLogsResponse(vmLogs);
        }),
        catchError(() => of(new vmLogsActions.LoadVmLogsResponse([]))));
    }));

  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private vmLogsService: VmLogsService,
  ) {
  }
}
