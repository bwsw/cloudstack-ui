import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AffinityGroup } from '../../../shared/models';
import { AffinityGroupService } from '../../../shared/services/affinity-group.service';

import * as affinityGroupActions from './affinity-groups.actions';

@Injectable()
export class AffinityGroupsEffects {
  @Effect()
  loadAffinityGroups$: Observable<Action> = this.actions$.pipe(
    ofType(affinityGroupActions.LOAD_AFFINITY_GROUPS_REQUEST),
    switchMap((action: affinityGroupActions.LoadAffinityGroupsRequest) => {
      return this.affinityGroupService.getList().pipe(
        map(
          (affinityGroups: AffinityGroup[]) =>
            new affinityGroupActions.LoadAffinityGroupsResponse(affinityGroups)
        ),
        catchError(() => of(new affinityGroupActions.LoadAffinityGroupsResponse([])))
      );
    })
  );

  constructor(private actions$: Actions, private affinityGroupService: AffinityGroupService) {}
}
