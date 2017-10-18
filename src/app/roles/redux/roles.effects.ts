import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as roleActions from './roles.actions';
import { Action } from '@ngrx/store';
import { RoleService } from '../../shared/services/role.service';
import { Role } from '../../shared/models/role.model';
import { AuthService } from '../../shared/services/auth.service';

@Injectable()
export class RolesEffects {

  @Effect()
  loadRoless$: Observable<Action> = this.actions$
    .ofType(roleActions.LOAD_ROLES_REQUEST)
    .switchMap((action: roleActions.LoadRolesRequest) => {
      return this.authService.isAdmin() ? this.roleService.getList(action.payload)
        .map((roles: Role[]) => {
          return new roleActions.LoadRolesResponse(roles);
        })
        .catch(() => Observable.of(new roleActions.LoadRolesResponse([]))):
        Observable.of(new roleActions.LoadRolesResponse([]));
    });

  constructor(
    private actions$: Actions,
    private roleService: RoleService,
    private authService: AuthService
  ) { }
}
