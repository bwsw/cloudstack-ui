import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { State } from '../..';
import { InstanceGroupService } from '../../../shared/services/instance-group.service';
import {
  InstanceGroupActionTypes,
  LoadInstanceGroupsResponse,
  LoadInstanceGroupsRequest,
} from './instance-group.actions';
import { LOAD_USER_ACCOUNT_RESPONSE } from '../../auth/redux/auth.actions';
import { VM_CHANGE_INSTANCE_GROUP_RESPONSE } from '../../vm/redux/vm.actions';

@Injectable()
export class InstanceGroupsEffects {
  @Effect()
  loadInstanceGroups$: Observable<Action> = this.actions$.pipe(
    ofType(InstanceGroupActionTypes.LOAD_INSTANCE_GROUPS_REQUEST),
    switchMap(() => {
      return this.instanceGroupService.getList().pipe(
        map(instanceGroups => new LoadInstanceGroupsResponse(instanceGroups)),
        catchError(() => of(new LoadInstanceGroupsResponse([]))),
      );
    }),
  );

  @Effect()
  reloadInstanceGroups$: Observable<Action> = this.actions$.pipe(
    ofType(LOAD_USER_ACCOUNT_RESPONSE, VM_CHANGE_INSTANCE_GROUP_RESPONSE),
    map(() => new LoadInstanceGroupsRequest()),
  );

  constructor(
    private store: Store<State>,
    private actions$: Actions,
    private instanceGroupService: InstanceGroupService,
  ) {}
}
