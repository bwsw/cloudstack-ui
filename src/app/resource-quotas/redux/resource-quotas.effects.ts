import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
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
import { MatDialog } from '@angular/material';

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
      return this.resourceQuotaService.updateResourceLimits(modifiedQuotas).pipe(
        map(() => {
          this.showNotificationsOnFinish('RESOURCE_QUOTAS_PAGE.ADMIN_PAGE.QUOTA_UPDATED');
          return new resourceQuotasActions.UpdateResourceQuotasResponse();
        }),
        catchError((error: Error) => {
          this.dialogService.showNotificationsOnFail(error);
          return of(new resourceQuotasActions.UpdateResourceQuotasError(error));
        }),
      );
    }),
  );

  @Effect()
  updateResourceLimits$ = this.actions$.pipe(
    ofType(resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_RESOURCE_LIMITS_REQUEST),
    withLatestFrom(this.store.pipe(select(getModifiedLimits))),
    switchMap(([_, modifiedLimits]) => {
      return this.resourceQuotaService.updateResources(modifiedLimits).pipe(
        map(() => {
          this.showNotificationsOnFinish('RESOURCE_QUOTAS_PAGE.REQUEST.LIMIT_UPDATED');
          this.matDialogService.closeAll();

          return new resourceQuotasActions.UpdateResourceLimitsResponse();
        }),
        catchError((error: Error) => {
          this.dialogService.showNotificationsOnFail(error);
          return of(new resourceQuotasActions.UpdateResourceLimitsError(error));
        }),
      );
    }),
  );

  @Effect()
  updateResourceResponse$ = this.actions$.pipe(
    ofType(
      resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_RESOURCE_LIMITS_ERROR,
      resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_RESOURCE_LIMITS_RESPONSE,
    ),
    switchMap(() =>
      of(
        new resourceLimitActions.LoadResourceLimitsForCurrentUser(null),
        // LoadAccountsRequest is needed to update the resource usage section
        new accountActions.LoadAccountsRequest(),
      ),
    ),
  );

  @Effect()
  updateResourceQuotasResponse$: Observable<Action> = this.actions$.pipe(
    ofType(
      resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_RESOURCE_QUOTAS_ERROR,
      resourceQuotasActions.ResourceQuotasActionTypes.UPDATE_RESOURCE_QUOTAS_RESPONSE,
    ),
    map(() => new resourceQuotasActions.LoadResourceQuotasRequest()),
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private store: Store<State>,
    private resourceQuotaService: ResourceQuotaService,
    private dialogService: DialogService,
    private snackBarService: SnackBarService,
    private matDialogService: MatDialog,
  ) {}

  private showNotificationsOnFinish(message: string) {
    this.snackBarService.open(message).subscribe();
  }
}
