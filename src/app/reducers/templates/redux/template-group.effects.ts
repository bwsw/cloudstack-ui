import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';

import { TemplateGroupService } from '../../../shared/services/template-group.service';

import * as actions from './template-group.actions';


@Injectable()
export class TemplateGroupEffects {
  @Effect()
  loadTemplateGroups$ = this.actions$.pipe(
    ofType(actions.LOAD_TEMPLATE_GROUP_REQUEST),
    switchMap((action: actions.LoadTemplateGroupsRequest) => {
      return this.templateGroupService.getList().pipe(
        map(groupList => new actions.LoadTemplateGroupsResponse(groupList ? groupList : [])));
    }));

  constructor(
    private actions$: Actions,
    private templateGroupService: TemplateGroupService
  ) {
  }
}
