import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of, zip } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import * as resourceQuotasActions from './resource-quotas.actions';
import { State } from '../../reducers';
import { Router } from '@angular/router';
import { ResourceQuotaService } from '../services/resource-quota.service';
import { ResourceQuota } from '../models/resource-quota.model';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { SnackBarService } from '../../core/services';
import * as fromResourceQuotas from '../redux/resource-quotas.reducer';
import * as fromResourceLimits from '../../reducers/resource-limit/redux/resource-limits.reducers';
import { getModifiedQuotas } from './selectors/modified-quotas.selector';
import { getModifiedLimits } from './selectors/modified-limits.selector';
import * as resourceLimitActions from '../../reducers/resource-limit/redux/resource-limits.actions';
import * as accountActions from '../../reducers/accounts/redux/accounts.actions';

const pick = require('lodash/pick');

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
  updateAdminFormOnQuotasLoaded$: Observable<Action> = this.actions$.pipe(
    ofType(resourceQuotasActions.ResourceQuotasActionTypes.LOAD_RESOURCE_QUOTAS_RESPONSE),
    withLatestFrom(this.store.pipe(select(fromResourceQuotas.getResourceQuotas))),
    map(([action, quotas]) => new resourceQuotasActions.UpdateAdminForm(quotas)),
  );

  @Effect()
  updateUserFormOnQuotasLoaded$: Observable<Action> = this.actions$.pipe(
    ofType(resourceQuotasActions.ResourceQuotasActionTypes.LOAD_RESOURCE_QUOTAS_RESPONSE),
    withLatestFrom(this.store.pipe(select(fromResourceQuotas.getResourceQuotas))),
    map(([action, quotas]) => new resourceQuotasActions.UpdateUserFormQuotas(quotas)),
  );

  @Effect()
  updateUserFormOnLimitsLoaded$: Observable<Action> = this.actions$.pipe(
    ofType(resourceLimitActions.LOAD_RESOURCE_LIMITS_RESPONSE),
    withLatestFrom(this.store.pipe(select(fromResourceLimits.selectEntities))),
    map(([action, limits]) => new resourceQuotasActions.UpdateUserFormLimits(limits)),
  );

  @Effect()
  updateResourceQuotas$ = this.actions$.pipe(
    ofType(resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_RESOURCE_QUOTAS_REQUEST),
    withLatestFrom(this.store.pipe(select(getModifiedQuotas))),
    switchMap(([_, modifiedQuotas]) => {
      const requests = modifiedQuotas.map(quota => {
        const params = pick(quota, ['resourceType', 'minimum', 'maximum']);
        return this.resourceQuotaService.updateResourceLimit(params);
      });

      return zip(...requests).pipe(
        map(() => {
          this.showNotificationsOnFinish('RESOURCE_QUOTAS_PAGE.ADMIN_PAGE.QUOTA_UPDATED');
          return new resourceQuotasActions.LoadResourceQuotasRequest();
        }),
        catchError((error: Error) => {
          this.dialogService.showNotificationsOnFail(error);
          return of(new resourceQuotasActions.LoadResourceQuotasRequest());
        }),
      );
    }),
  );

  @Effect()
  updateResourceLimit$ = this.actions$.pipe(
    ofType(resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_RESOURCE_LIMITS_REQUEST),
    withLatestFrom(this.store.pipe(select(getModifiedLimits))),
    switchMap(([_, modifiedLimits]) => {
      const requests = modifiedLimits.map(limit => {
        const params = pick(limit, ['resourceType', 'max']);
        return this.resourceQuotaService.updateResource(params);
      });

      return zip(...requests).pipe(
        switchMap(() => {
          this.showNotificationsOnFinish('RESOURCE_QUOTAS_PAGE.REQUEST.LIMIT_UPDATED');
          return of(
            new resourceLimitActions.LoadResourceLimitsForCurrentUser(null),
            new accountActions.LoadAccountsRequest(),
          );
        }),
        catchError((error: Error) => {
          this.dialogService.showNotificationsOnFail(error);
          return of(
            new resourceLimitActions.LoadResourceLimitsForCurrentUser(null),
            new accountActions.LoadAccountsRequest(),
          );
        }),
      );
    }),
  );

  @Effect()
  loadResourceQuotasOnUpdated$: Observable<Action> = this.actions$.pipe(
    ofType(resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_RESOURCE_QUOTAS_ERROR),
    map(() => new resourceQuotasActions.LoadResourceQuotasRequest()),
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
