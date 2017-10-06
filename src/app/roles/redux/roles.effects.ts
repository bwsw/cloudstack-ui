import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import * as roleEvent from './roles.actions';
import { Action } from '@ngrx/store';
import { RoleService } from '../../shared/services/role.service';
import { Role } from '../../shared/models/role.model';
import { AuthService } from '../../shared/services/auth.service';

@Injectable()
export class RolesEffects {

  @Effect()
  loadEvents$: Observable<Action> = this.actions$
    .ofType(roleEvent.LOAD_ROLES_REQUEST)
    .switchMap((action: roleEvent.LoadRolesRequest) => {
      return this.authService.isAdmin() ? this.roleService.getList(action.payload)
        .map((roles: Role[]) => {
          return new roleEvent.LoadRolesResponse(roles);
        })
        .catch(() => Observable.of(new roleEvent.LoadRolesResponse([]))):
        Observable.of(new roleEvent.LoadRolesResponse([]));
    });

  constructor(
    private actions$: Actions,
    private roleService: RoleService,
    private authService: AuthService
  ) { }
}
