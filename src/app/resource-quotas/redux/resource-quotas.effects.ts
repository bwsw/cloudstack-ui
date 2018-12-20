import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as resourceQuotasActions from './resource-quotas.actions';
import { State } from '../../reducers';
import { Router } from '@angular/router';
import { ResourceQuotaService } from '../services/resource-quota.service';
import { ResourceQuota } from '../models/resource-quota.model';

@Injectable()
export class ResourceQuotasEffects {
  @Effect()
  loadVmLogs$: Observable<Action> = this.actions$.pipe(
    ofType(resourceQuotasActions.ResourceQuotasActionTypes.LOAD_RESOURCE_QUOTAS_REQUEST),
    switchMap(() => {
      return this.resourceQuotaService.getList().pipe(
        map((vmLogs: ResourceQuota[]) => {
          return new resourceQuotasActions.LoadResourceQuotasResponse(vmLogs);
        }),
        catchError(() => of(new resourceQuotasActions.LoadResourceQuotasResponse([]))),
      );
    }),
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<State>,
    private resourceQuotaService: ResourceQuotaService,
  ) {}
}
