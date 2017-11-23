import { Injectable } from '@angular/core';
import {
  Actions,
  Effect
} from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action } from '@ngrx/store';
import { OsType } from '../../../shared/models/os-type.model';
import { OsTypeService } from '../../../shared/services/os-type.service';

import * as osTypesActions from './ostype.actions';


@Injectable()
export class OsTypeEffects {
  @Effect()
  loadOsTypes$: Observable<Action> = this.actions$
    .ofType(osTypesActions.LOAD_OS_TYPES_REQUEST)
    .switchMap((action: osTypesActions.LoadOsTypesRequest) => {
      return this.osTypesService.getList(action.payload)
        .map((osTypes: OsType[]) =>  new osTypesActions.LoadOsTypesResponse(osTypes))
        .catch(() => Observable.of(new osTypesActions.LoadOsTypesResponse([])));
    });

  constructor(
    private actions$: Actions,
    private osTypesService: OsTypeService
  ) {
  }
}
