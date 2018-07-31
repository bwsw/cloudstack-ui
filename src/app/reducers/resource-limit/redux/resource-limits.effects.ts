import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as resourceLimitActions from './resource-limits.actions';
import { Action } from '@ngrx/store';
import { ResourceLimitService } from '../../../shared/services/resource-limit.service';
import { ResourceLimit } from '../../../shared/models/resource-limit.model';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';

@Injectable()
export class ResourceLimitsEffects {

  @Effect()
  loadResourseLimits$: Observable<Action> = this.actions$
    .ofType(resourceLimitActions.LOAD_RESOURCE_LIMITS_REQUEST)
    .switchMap((action: resourceLimitActions.LoadResourceLimitsRequest) => {
      return this.resourceLimitService.getList(action.payload)
        .map((limits: ResourceLimit[]) => {
          return new resourceLimitActions.LoadResourceLimitsResponse(limits);
        })
        .catch(() => Observable.of(new resourceLimitActions.LoadResourceLimitsResponse([])));
    });

  @Effect()
  updateResourceLimits$: Observable<Action> = this.actions$
    .ofType(resourceLimitActions.UPDATE_RESOURCE_LIMITS_REQUEST)
    .mergeMap((action: resourceLimitActions.UpdateResourceLimitsRequest) => {
      const account = action.payload[0].account;
      const domainid = action.payload[0].domainid;

      const observes = action.payload.map(limit =>
        this.resourceLimitService.updateResourceLimit(limit));

      return Observable.forkJoin(observes)
        .map(() => {
          return new resourceLimitActions.LoadResourceLimitsRequest({
            domainid,
            account
          });
        })
        .catch((error) => Observable.of(new resourceLimitActions.UpdateResourceLimitsError(error)));
    });

  @Effect({ dispatch: false })
  updateResourceLimitsError$: Observable<Action> = this.actions$
    .ofType(resourceLimitActions.UPDATE_RESOURCE_LIMITS_ERROR)
    .do((action: resourceLimitActions.UpdateResourceLimitsError) => {
      this.handleError(action.payload);
    });

  constructor(
    private actions$: Actions,
    private resourceLimitService: ResourceLimitService,
    private dialogService: DialogService
  ) {
  }

  private handleError(error): void {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }

}
