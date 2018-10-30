import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as resourceCountActions from './resource-counts.actions';
import { ResourceCountService } from '../../../shared/services/resource-count.service';
import { ResourceCount } from '../../../shared/models/resource-count.model';

@Injectable()
export class ResourceCountsEffects {
  @Effect()
  loadResourceLimits$: Observable<Action> = this.actions$.pipe(
    ofType(resourceCountActions.LOAD_RESOURCE_COUNTS_REQUEST),
    switchMap((action: resourceCountActions.LoadResourceCountsRequest) => {
      return this.resourceCountService.updateResourceCount(action.payload).pipe(
        map((stats: ResourceCount[]) => {
          return new resourceCountActions.LoadResourceCountsResponse(stats);
        }),
        catchError(() => of(new resourceCountActions.LoadResourceCountsResponse([]))),
      );
    }),
  );

  constructor(private actions$: Actions, private resourceCountService: ResourceCountService) {}
}
