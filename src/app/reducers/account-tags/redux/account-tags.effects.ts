import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../../../shared/services/config.service';
import { AccountTagService } from '../../../shared/services/tags/account-tag.service';
import { TagService } from '../../../shared/services/tags/tag.service';
import * as actions from './account-tags.actions';

@Injectable()
export class AccountTagsEffects {

  @Effect()
  loadAccountTags$ = this.actions$
    .ofType(actions.LOAD_ACCOUNT_TAGS_REQUEST)
    .filter(() => this.isAccountTagEnabled())
    .switchMap((action: actions.LoadAccountTagsRequest) => {
      return this.tagService.getList(action.payload)
        .map(tags => new actions.LoadAccountTagsResponse(tags))
        .catch(() => Observable.of(new actions.LoadAccountTagsResponse([])));
    });

  @Effect()
  updateCustomServiceOfferingParams$: Observable<Action> = this.actions$
    .ofType(actions.UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS)
    .filter(() => this.isAccountTagEnabled())
    .switchMap((action: actions.UpdateCustomServiceOfferingParams) => {
      return this.accountTagService.setServiceOfferingParams(action.payload)
        .map((offering) => new actions.UpdateCustomServiceOfferingParamsSuccess(offering))
        .catch(error => Observable.of(new actions.UpdateCustomServiceOfferingParamsError(error)));
    });


  constructor(
    private actions$: Actions,
    private tagService: TagService,
    private accountTagService: AccountTagService,
    private configService: ConfigService
  ) { }

  public isAccountTagEnabled(): boolean {
    return this.configService.get<boolean>('accountTagsEnabled');
  }
}
