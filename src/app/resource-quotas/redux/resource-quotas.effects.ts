import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { concat, forkJoin, merge, Observable, of } from 'rxjs';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import * as pick from 'lodash/pick';
import * as resourceQuotasActions from './resource-quotas.actions';
import { State } from '../../reducers';
import { Router } from '@angular/router';
import { ResourceQuotaService } from '../services/resource-quota.service';
import { ResourceQuota } from '../models/resource-quota.model';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { SnackBarService } from '../../core/services';
import * as fromResourceQuotas from '../redux/resource-quotas.reducer';
import { getModifiedQuotas } from './selectors/modified-quotas.selector';

@Injectable()
export class ResourceQuotasEffects {
  @Effect()
  loadResourceQuotas$: Observable<Action> = this.actions$.pipe(
    ofType(resourceQuotasActions.ResourceQuotasActionTypes.LOAD_RESOURCE_QUOTAS_REQUEST),
    switchMap(() => {
      return this.resourceQuotaService.getList().pipe(
        map((vmLogs: ResourceQuota[]) => {
          return new resourceQuotasActions.LoadResourceQuotasResponse(vmLogs);
        }),
        catchError(error => {
          return of(new resourceQuotasActions.LoadResourceQuotasError(error));
        }),
      );
    }),
  );

  @Effect()
  updateFormOnQuotasLoaded$: Observable<Action> = this.actions$.pipe(
    ofType(resourceQuotasActions.ResourceQuotasActionTypes.LOAD_RESOURCE_QUOTAS_RESPONSE),
    withLatestFrom(this.store.pipe(select(fromResourceQuotas.getResourceQuotas))),
    map(([action, quotas]) => new resourceQuotasActions.UpdateAdminForm(quotas)),
  );

  @Effect()
  updateResourceQuotas$ = this.actions$.pipe(
    ofType<resourceQuotasActions.UpdateResourceLimitsRequest>(
      resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_RESOURCE_LIMITS_REQUEST,
    ),
    withLatestFrom(this.store.pipe(select(getModifiedQuotas))),
    switchMap(([_, modifiedQuotas]) => {
      const requests = modifiedQuotas.map(quota => {
        const params = pick(quota, ['resourceType', 'minimum', 'maximum']);
        return this.resourceQuotaService.updateResourceLimit(params);
      });

      return forkJoin(requests).pipe(
        map(() => {
          this.showNotificationsOnFinish('RESOURCE_QUOTAS_PAGE.ADMIN_PAGE.LIMIT_UPDATED');
          return new resourceQuotasActions.LoadResourceQuotasRequest({
            showLoader: false,
          });
        }),
        catchError((error: Error) => {
          this.dialogService.showNotificationsOnFail(error);
          return of(new resourceQuotasActions.UpdateResourceLimitsError(error));
        }),
      );
    }),
  );

  @Effect()
  loadResourceQuotasOnUpdated$: Observable<Action> = this.actions$.pipe(
    ofType(resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_RESOURCE_LIMITS_ERROR),
    map(
      () =>
        new resourceQuotasActions.LoadResourceQuotasRequest({
          showLoader: true,
        }),
    ),
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<State>,
    private resourceQuotaService: ResourceQuotaService,
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
  ) {}

  private showNotificationsOnFinish(message: string) {
    this.snackBarService.open(message).subscribe();
  }
}
