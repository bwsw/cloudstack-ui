import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { AffinityGroup } from '../../../shared/models/index';
import { AffinityGroupService } from '../../../shared/services/affinity-group.service';

import * as affinityGroupActions from './affinity-groups.actions';

@Injectable()
export class AffinityGroupsEffects {

  @Effect()
  loadAffinityGroups$: Observable<Action> = this.actions$
    .ofType(affinityGroupActions.LOAD_AFFINITY_GROUPS_REQUEST)
    .switchMap((action: affinityGroupActions.LoadAffinityGroupsRequest) => {
      return this.affinityGroupService.getList()
        .map((affinityGroups: AffinityGroup[]) => new affinityGroupActions.LoadAffinityGroupsResponse(affinityGroups))
        .catch(() => Observable.of(new affinityGroupActions.LoadAffinityGroupsResponse([])));
    });

  constructor(
    private actions$: Actions,
    private affinityGroupService: AffinityGroupService
  ) {
  }
}
