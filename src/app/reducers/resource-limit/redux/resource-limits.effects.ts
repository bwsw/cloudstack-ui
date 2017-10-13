import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as resourceLimitActions from './resource-limits.actions';
import { Action } from '@ngrx/store';
import { ResourceLimitService } from '../../../shared/services/resource-limit.service';
import { ResourceLimit } from '../../../shared/models/resource-limit.model';

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
    .switchMap((action: resourceLimitActions.UpdateResourceLimitsRequest) => {
          const observes = action.payload.limits.map(limit =>
            this.resourceLimitService.updateResourceLimit(limit, action.payload.account));
          return Observable.forkJoin(observes)
        .map(() => {
          return new resourceLimitActions.LoadResourceLimitsRequest({
            domianId: action.payload.account.domainid,
            account: action.payload.account.name
          });
        })
        .catch(() => Observable.of(new resourceLimitActions.LoadResourceLimitsRequest({
          domianId: action.payload.account.domainid,
          account: action.payload.account.name
        })));
    });

  constructor(
    private actions$: Actions,
    private resourceLimitService: ResourceLimitService
  ) { }
}
