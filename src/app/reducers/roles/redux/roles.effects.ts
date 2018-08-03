import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as roleActions from './roles.actions';
import { Action } from '@ngrx/store';
import { RoleService } from '../../../shared/services/role.service';
import { Role } from '../../../shared/models/role.model';

@Injectable()
export class RolesEffects {

  @Effect()
  loadRoles$: Observable<Action> = this.actions$
    .ofType(roleActions.LOAD_ROLES_REQUEST)
    .switchMap((action: roleActions.LoadRolesRequest) => {
      return this.roleService.getList(action.payload)
        .map((roles: Role[]) => {
          return new roleActions.LoadRolesResponse(roles);
        })
        .catch(() => Observable.of(new roleActions.LoadRolesResponse([])));
    });

  constructor(
    private actions$: Actions,
    private roleService: RoleService
  ) { }
}
