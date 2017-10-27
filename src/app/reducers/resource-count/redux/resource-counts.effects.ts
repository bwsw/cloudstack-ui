import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as resourceCountActions from './resource-counts.actions';
import { Action } from '@ngrx/store';
import { ResourceCountService } from '../../../shared/services/resource-count.service';
import { ResourceCount } from '../../../shared/models/resource-count.model';

@Injectable()
export class ResourceCountsEffects {

  @Effect()
  loadResourceLimits$: Observable<Action> = this.actions$
    .ofType(resourceCountActions.LOAD_RESOURCE_COUNTS_REQUEST)
    .switchMap((action: resourceCountActions.LoadResourceCountsRequest) => {
      return this.resourceCountService.updateResourceCount(action.payload)
        .map((stats: ResourceCount[]) => {
          return new resourceCountActions.LoadResourceCountsResponse(stats);
        })
        .catch(() => Observable.of(new resourceCountActions.LoadResourceCountsResponse([])));
    });

  constructor(
    private actions$: Actions,
    private resourceCountService: ResourceCountService
  ) { }
}
