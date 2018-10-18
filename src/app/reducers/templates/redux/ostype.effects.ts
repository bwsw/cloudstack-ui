import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { OsType } from '../../../shared/models/os-type.model';
import { OsTypeService } from '../../../shared/services/os-type.service';

import * as osTypesActions from './ostype.actions';

@Injectable()
export class OsTypeEffects {
  @Effect()
  loadOsTypes$: Observable<Action> = this.actions$.pipe(
    ofType(osTypesActions.LOAD_OS_TYPES_REQUEST),
    switchMap((action: osTypesActions.LoadOsTypesRequest) => {
      return this.osTypesService.getList(action.payload).pipe(
        map((osTypes: OsType[]) => new osTypesActions.LoadOsTypesResponse(osTypes)),
        catchError(() => of(new osTypesActions.LoadOsTypesResponse([]))),
      );
    }),
  );

  constructor(private actions$: Actions, private osTypesService: OsTypeService) {}
}
