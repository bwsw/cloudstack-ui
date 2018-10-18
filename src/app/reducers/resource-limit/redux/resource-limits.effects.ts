import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import * as resourceLimitActions from './resource-limits.actions';
import { ResourceLimitService } from '../../../shared/services/resource-limit.service';
import { ResourceLimit } from '../../../shared/models/resource-limit.model';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';

@Injectable()
export class ResourceLimitsEffects {
  @Effect()
  loadResourseLimits$: Observable<Action> = this.actions$.pipe(
    ofType(resourceLimitActions.LOAD_RESOURCE_LIMITS_REQUEST),
    switchMap((action: resourceLimitActions.LoadResourceLimitsRequest) => {
      return this.resourceLimitService.getList(action.payload).pipe(
        map((limits: ResourceLimit[]) => {
          return new resourceLimitActions.LoadResourceLimitsResponse(limits);
        }),
        catchError(() => of(new resourceLimitActions.LoadResourceLimitsResponse([]))),
      );
    }),
  );

  @Effect()
  updateResourceLimits$: Observable<Action> = this.actions$.pipe(
    ofType(resourceLimitActions.UPDATE_RESOURCE_LIMITS_REQUEST),
    mergeMap((action: resourceLimitActions.UpdateResourceLimitsRequest) => {
      const account = action.payload[0].account;
      const domainid = action.payload[0].domainid;

      const observes = action.payload.map(limit =>
        this.resourceLimitService.updateResourceLimit(limit),
      );

      return forkJoin(observes).pipe(
        map(() => {
          return new resourceLimitActions.LoadResourceLimitsRequest({
            domainid,
            account,
          });
        }),
        catchError(error => of(new resourceLimitActions.UpdateResourceLimitsError(error))),
      );
    }),
  );

  @Effect({ dispatch: false })
  updateResourceLimitsError$: Observable<Action> = this.actions$.pipe(
    ofType(resourceLimitActions.UPDATE_RESOURCE_LIMITS_ERROR),
    tap((action: resourceLimitActions.UpdateResourceLimitsError) => {
      this.handleError(action.payload);
    }),
  );

  constructor(
    private actions$: Actions,
    private resourceLimitService: ResourceLimitService,
    private dialogService: DialogService,
  ) {}

  private handleError(error): void {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params,
      },
    });
  }
}
