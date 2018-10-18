import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import * as roleActions from './roles.actions';
import { RoleService } from '../../../shared/services/role.service';
import { Role } from '../../../shared/models/role.model';

@Injectable()
export class RolesEffects {
  @Effect()
  loadRoles$: Observable<Action> = this.actions$.pipe(
    ofType(roleActions.LOAD_ROLES_REQUEST),
    switchMap((action: roleActions.LoadRolesRequest) => {
      return this.roleService.getList(action.payload).pipe(
        map((roles: Role[]) => {
          return new roleActions.LoadRolesResponse(roles);
        }),
        catchError(() => of(new roleActions.LoadRolesResponse([]))),
      );
    }),
  );

  constructor(private actions$: Actions, private roleService: RoleService) {}
}
