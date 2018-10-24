import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

import { AffinityGroup } from '../../../shared/models';
import { AffinityGroupService } from '../../../shared/services/affinity-group.service';

import * as affinityGroupActions from './affinity-groups.actions';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';

@Injectable()
export class AffinityGroupsEffects {
  @Effect()
  loadAffinityGroups$: Observable<Action> = this.actions$.pipe(
    ofType(affinityGroupActions.LOAD_AFFINITY_GROUPS_REQUEST),
    switchMap((action: affinityGroupActions.LoadAffinityGroupsRequest) => {
      return this.affinityGroupService.getList().pipe(
        map(
          (affinityGroups: AffinityGroup[]) =>
            new affinityGroupActions.LoadAffinityGroupsResponse(affinityGroups),
        ),
        catchError(() => of(new affinityGroupActions.LoadAffinityGroupsResponse([]))),
      );
    }),
  );

  @Effect()
  createAffinityGroup$: Observable<Action> = this.actions$.pipe(
    ofType(affinityGroupActions.CREATE_AFFINITY_GROUP),
    mergeMap((action: affinityGroupActions.CreateAffinityGroup) => {
      return this.affinityGroupService.create(action.payload).pipe(
        map(ag => new affinityGroupActions.CreateAffinityGroupSuccess(ag)),
        catchError(error => {
          this.dialogService.showNotificationsOnFail(error);
          return of(new affinityGroupActions.CreateAffinityGroupError(error));
        }),
      );
    }),
  );

  constructor(
    private actions$: Actions,
    private affinityGroupService: AffinityGroupService,
    private dialogService: DialogService,
  ) {}
}
