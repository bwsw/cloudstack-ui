import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { TagService } from '../../../shared/services/tags/tag.service';
import * as actions from './account-tags.actions';

@Injectable()
export class AccountTagsEffects {

  @Effect()
  loadAccountTags$: Observable<Action> = this.actions$
    .ofType(actions.LOAD_ACCOUNT_TAGS_REQUEST)
    .switchMap((action: actions.LoadAccountTagsRequest) => {
      return this.tagService.getList(action.payload)
        .map(tags => new actions.LoadAccountTagsResponse(tags))
        .catch(() => Observable.of(new actions.LoadAccountTagsResponse([])));
    });

  constructor(
    private actions$: Actions,
    private tagService: TagService
  ) { }
}
