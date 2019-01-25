import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, switchMap } from 'rxjs/operators';

import { TagService } from '../../../shared/services/tags/tag.service';
import {
  AccountTagsActionTypes,
  CreateTag,
  CreateTagError,
  CreateTagSuccess,
  DeleteTag,
  DeleteTagError,
  DeleteTagSuccess,
  LOAD_ACCOUNT_TAGS_REQUEST,
  LoadAccountTagsRequest,
  LoadAccountTagsResponse,
  UpdateTag,
  UpdateTagError,
  UpdateTagSuccess,
} from './account-tags.actions';
import { TagCreationParams } from '../../../root-store/server-data/user-tags/tag-creation-params';
import { accountResourceType, TagUpdatingParams } from '../../../shared/models';
import * as authSelectors from '../../auth/redux/auth.reducers';
import { State } from '../../index';

@Injectable()
export class AccountTagsEffects {
  @Effect()
  loadAccountTags$: Observable<Action> = this.actions$.pipe(
    ofType(LOAD_ACCOUNT_TAGS_REQUEST),
    switchMap((action: LoadAccountTagsRequest) => {
      return this.tagService.getList(action.payload).pipe(
        map(tags => new LoadAccountTagsResponse(tags)),
        catchError(() => of(new LoadAccountTagsResponse([]))),
      );
    }),
  );

  @Effect()
  updateTag$: Observable<Action> = this.actions$.pipe(
    ofType<UpdateTag>(AccountTagsActionTypes.UpdateTag),
    map(action => action.payload),
    mergeMap((value: TagUpdatingParams) => {
      const { newTag, oldKey } = value;

      return this.updateTag(newTag, oldKey).pipe(
        map(() => new UpdateTagSuccess({ newTag, oldKey })),
        catchError(error => of(new UpdateTagError({ error }))),
      );
    }),
  );

  @Effect()
  createTag$: Observable<Action> = this.actions$.pipe(
    ofType<CreateTag>(AccountTagsActionTypes.CreateTag),
    map(action => action.payload),
    exhaustMap((value: TagCreationParams) => {
      return this.createTag(value).pipe(
        map(() => new CreateTagSuccess(value)),
        catchError(error => of(new CreateTagError({ error }))),
      );
    }),
  );

  @Effect()
  deleteTag$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteTag>(AccountTagsActionTypes.DeleteTag),
    map(action => action.payload),
    exhaustMap((key: string) => {
      return this.deleteTag([{ key }]).pipe(
        map(() => new DeleteTagSuccess(key)),
        catchError(error => of(new DeleteTagError({ error }))),
      );
    }),
  );

  constructor(
    private actions$: Actions,
    private tagService: TagService,
    private store: Store<State>,
  ) {}

  private get resourceId(): Observable<string> {
    return this.store.pipe(select(authSelectors.getUserAccountId));
  }

  private updateTag(tag: TagCreationParams, oldTagKey: string) {
    return this.deleteTag([{ key: oldTagKey }]).pipe(
      switchMap(() => this.createTag(tag)),
      catchError(() => this.createTag(tag)),
    );
  }

  private deleteTag(keys: { key: string }[]) {
    const tagsData = keys.reduce(
      (acc, { key }, index) => ({
        ...acc,
        [`tags[${index}].key`]: key,
      }),
      {},
    );

    return this.resourceId.pipe(
      switchMap(resourceId => {
        return this.tagService.remove({
          resourceids: resourceId,
          resourcetype: accountResourceType,
          ...tagsData,
        });
      }),
    );
  }

  private createTag(tag: TagCreationParams | TagCreationParams[]) {
    const tagsArray = [].concat(tag);
    const tagsData = tagsArray.reduce(
      (acc, { key, value }, index) => ({
        ...acc,
        [`tags[${index}].key`]: key,
        [`tags[${index}].value`]: value,
      }),
      {},
    );

    return this.resourceId.pipe(
      switchMap(resourceId => {
        return this.tagService.create({
          resourceids: resourceId,
          resourcetype: accountResourceType,
          ...tagsData,
        });
      }),
    );
  }
}
