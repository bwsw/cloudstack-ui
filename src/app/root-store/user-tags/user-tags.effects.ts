import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { switchMap } from 'rxjs/operators/switchMap';
import { map } from 'rxjs/operators/map';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { catchError } from 'rxjs/operators/catchError';

import {
  LoadUserTags,
  UserTagsActionTypes,
  UserTagsLoaded,
  UserTagsLoadError,
  UserTagUpdated,
  UserTagUpdateError
} from './user-tags.actions';
import { TagService } from '../../shared/services/tags/tag.service';
import { AuthService } from '../../shared/services/auth.service';
import { Tag } from '../../shared/models';
import { userTagKeys } from './user-tag-keys';

const castValueToString = map(({ key, value }) => {
  switch (typeof value) {
    case 'boolean': {
      return {
        key,
        value: value ? 'true' : 'false'
      }
    }
    case 'number': {
      return {
        key,
        value: `${value}`
      }
    }
    default: {
      return {
        key,
        value: value
      }
    }
  }
});

const addTagKey = map((action: any) => {
  let tagKey: string;
  switch (action.type) {
    case UserTagsActionTypes.UPDATE_ASK_TO_CREATE_VM_TAG:
      tagKey = userTagKeys.askToCreateVM;
      break;
    case UserTagsActionTypes.UPDATE_ASK_TO_CREATE_VOLUME_TAG:
      tagKey = userTagKeys.askToCreateVolume;
      break;
    case UserTagsActionTypes.UPDATE_SAVE_PASSWORD_FOR_ALL_VMS_TAG:
      tagKey = userTagKeys.savePasswordForAllVMs;
      break;
    case UserTagsActionTypes.UPDATE_FIRST_DAY_OF_WEEK_TAG:
      tagKey = userTagKeys.firstDayOfWeek;
      break;
    case UserTagsActionTypes.UPDATE_INTERFACE_LANGUAGE_TAG:
      tagKey = userTagKeys.lang;
      break;
    case UserTagsActionTypes.UPDATE_LAST_VM_ID_TAG:
      tagKey = userTagKeys.lastVMId;
      break;
    case UserTagsActionTypes.UPDATE_SESSION_TIMEOUT_TAG:
      tagKey = userTagKeys.sessionTimeout;
      break;
    case UserTagsActionTypes.UPDATE_SHOW_SYSTEM_TAGS_TAG:
      tagKey = userTagKeys.showSystemTags;
      break;
    case UserTagsActionTypes.UPDATE_TIME_FORMAT_TAG:
      tagKey = userTagKeys.timeFormat;
      break;
    case UserTagsActionTypes.UPDATE_THEME_TAG:
      tagKey = userTagKeys.theme;
      break;
    case UserTagsActionTypes.UPDATE_NAVIGATION_ORDER_TAG:
      tagKey = userTagKeys.navigationOrder;
      break;
  }

  return {
    value: action.payload.value,
    key: tagKey
  }
});

@Injectable()
export class UserTagsEffects {
  @Effect()
  loadUserTags$: Observable<Action> = this.actions$.pipe(
    ofType<LoadUserTags>(UserTagsActionTypes.LOAD_USER_TAGS),
    switchMap(() =>
      this.loadTags().pipe(
        map((tags: Tag[]) => new UserTagsLoaded({ tags })),
        catchError(error => of(new UserTagsLoadError({ error })))
      )
    )
  );

  @Effect()
  updateUserTag$: Observable<Action> = this.actions$.pipe(
    ofType(
      UserTagsActionTypes.UPDATE_ASK_TO_CREATE_VM_TAG,
      UserTagsActionTypes.UPDATE_ASK_TO_CREATE_VOLUME_TAG,
      UserTagsActionTypes.UPDATE_SAVE_PASSWORD_FOR_ALL_VMS_TAG,
      UserTagsActionTypes.UPDATE_FIRST_DAY_OF_WEEK_TAG,
      UserTagsActionTypes.UPDATE_INTERFACE_LANGUAGE_TAG,
      UserTagsActionTypes.UPDATE_LAST_VM_ID_TAG,
      UserTagsActionTypes.UPDATE_SESSION_TIMEOUT_TAG,
      UserTagsActionTypes.UPDATE_SHOW_SYSTEM_TAGS_TAG,
      UserTagsActionTypes.UPDATE_TIME_FORMAT_TAG,
      UserTagsActionTypes.UPDATE_THEME_TAG,
      UserTagsActionTypes.UPDATE_NAVIGATION_ORDER_TAG
    ),
    addTagKey,
    castValueToString,
    mergeMap(({ key, value }) =>
      this.upsertTag(key, value).pipe(
        map(() => new UserTagUpdated()),
        catchError((err) => of(new UserTagUpdateError({ error: err })))
      )
    )
  );

  @Effect()
  userTagUpdated$: Observable<Action> = this.actions$.pipe(
    ofType<UserTagUpdated>(UserTagsActionTypes.USER_TAG_UPDATED),
    switchMap(() =>
      this.loadTags().pipe(
        map((tags: Tag[]) => new UserTagsLoaded({ tags })),
        catchError(error => of(new UserTagsLoadError({ error })))
      )
    )
  );

  private readonly resourceType = 'User';

  private get resourceId(): string | null {
    return this.authService.user.userid;
  }

  constructor(
    private actions$: Actions,
    private tagService: TagService,
    private authService: AuthService
  ) {
  }

  private loadTags() {
    return this.tagService.getList({
      resourceid: this.resourceId
    });
  }

  private upsertTag(key: string, value: string) {
    return this.deleteTag(key).pipe(
      switchMap(() => this.createTag(key, value)),
      catchError(() => this.createTag(key, value))
    )
  }

  private deleteTag(key: string) {
    return this.tagService.remove({
      resourceids: this.resourceId,
      resourcetype: this.resourceType,
      'tags[0].key': key
    })
  }

  private createTag(key: string, value: string) {
    return this.tagService.create({
      resourceids: this.resourceId,
      resourcetype: this.resourceType,
      'tags[0].key': key,
      'tags[0].value': value
    })
  }
}
