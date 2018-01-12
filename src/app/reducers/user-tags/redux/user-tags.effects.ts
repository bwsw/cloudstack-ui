import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { TagService } from '../../../shared/services/tags/tag.service';
import { UserTagService } from '../../../shared/services/tags/user-tag.service';
import * as actions from './user-tags.actions';

@Injectable()
export class UserTagsEffects {

  @Effect()
  loadUserTags$ = this.actions$
    .ofType(actions.LOAD_USER_TAGS_REQUEST)
    .switchMap((action: actions.LoadUserTagsRequest) => {
      return this.tagService.getList(action.payload)
        .map(tags => new actions.LoadUserTagsResponse(tags))
        .catch(() => Observable.of(new actions.LoadUserTagsResponse([])));
    });

  @Effect()
  updateCustomServiceOfferingParams$: Observable<Action> = this.actions$
    .ofType(actions.UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS)
    .switchMap((action: actions.UpdateCustomServiceOfferingParams) => {
      return this.userTagService.setServiceOfferingParams(action.payload)
        .map((offering) => new actions.UpdateCustomServiceOfferingParamsSuccess(offering))
        .catch(error => Observable.of(new actions.UpdateCustomServiceOfferingParamsError(error)));
    });


  constructor(
    private actions$: Actions,
    private tagService: TagService,
    private userTagService: UserTagService
  ) { }
}
