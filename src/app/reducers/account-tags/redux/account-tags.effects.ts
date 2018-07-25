import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { ConfigService } from '../../../core/services';
import { AccountTagService } from '../../../shared/services/tags/account-tag.service';
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

  @Effect()
  updateCustomServiceOfferingParams$: Observable<Action> = this.actions$
    .ofType(actions.UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS)
    .switchMap((action: actions.UpdateCustomServiceOfferingParams) => {
      return this.accountTagService.setServiceOfferingParams(action.payload)
        .map((offering) => new actions.UpdateCustomServiceOfferingParamsSuccess(offering))
        .catch(error => Observable.of(new actions.UpdateCustomServiceOfferingParamsError(error)));
    });

  @Effect({ dispatch: false })
  updateCustomServiceOfferingParamsError$: Observable<Action> = this.actions$
    .ofType(actions.UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS_ERROR)
    .do((action: actions.UpdateCustomServiceOfferingParamsError) => {
      this.handleError(action.payload);
    });


  constructor(
    private actions$: Actions,
    private tagService: TagService,
    private accountTagService: AccountTagService,
    private configService: ConfigService,
    private dialogService: DialogService
  ) { }

  private handleError(error: any): void {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });
  }
}
