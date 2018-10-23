import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { TagService } from '../../../shared/services/tags/tag.service';
import * as actions from './account-tags.actions';

@Injectable()
export class AccountTagsEffects {
  @Effect()
  loadAccountTags$: Observable<Action> = this.actions$.pipe(
    ofType(actions.LOAD_ACCOUNT_TAGS_REQUEST),
    switchMap((action: actions.LoadAccountTagsRequest) => {
      return this.tagService.getList(action.payload).pipe(
        map(tags => new actions.LoadAccountTagsResponse(tags)),
        catchError(() => of(new actions.LoadAccountTagsResponse([]))),
      );
    }),
  );

  constructor(private actions$: Actions, private tagService: TagService) {}
}
