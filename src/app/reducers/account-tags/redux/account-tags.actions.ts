import { Action } from '@ngrx/store';
import { Tag, TagUpdatingParams } from '../../../shared/models';
import { TagCreationParams } from '../../../root-store/server-data/user-tags/tag-creation-params';
import { UserTagsActionTypes } from '../../../root-store/server-data/user-tags/user-tags.actions';

export const LOAD_ACCOUNT_TAGS_REQUEST = '[ACCOUNT_TAGS] LOAD_ACCOUNT_TAGS_REQUEST';
export const LOAD_ACCOUNT_TAGS_RESPONSE = '[ACCOUNT_TAGS] LOAD_ACCOUNT_TAGS_RESPONSE';

export enum AccountTagsActionTypes {
  UpdateTag = '[Settings Page] Update account tag',
  UpdateTagError = '[Settings Page] Update account tag error',
  UpdateTagSuccess = '[Settings Page] Update account tag success',

  DeleteTag = '[Settings Page] Delete account tag',
  DeleteTagError = '[Settings Page] Delete account tag error',
  DeleteTagSuccess = '[Settings Page] Delete account tag success',

  CreateTag = '[Settings Page] Create account tag',
  CreateTagError = '[Settings Page] Create account tag error',
  CreateTagSuccess = '[Settings Page] Create account tag success',

  UpdateAccountTagsFilter = '[Settings Page] Update account tags filter',
}

export class UpdateAccountTagsFilter implements Action {
  readonly type = AccountTagsActionTypes.UpdateAccountTagsFilter;

  constructor(public payload: { showSystemTag: boolean }) {}
}

export class LoadAccountTagsRequest implements Action {
  readonly type = LOAD_ACCOUNT_TAGS_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadAccountTagsResponse implements Action {
  readonly type = LOAD_ACCOUNT_TAGS_RESPONSE;

  constructor(readonly payload: Tag[]) {}
}

// Settings
export class UpdateTag implements Action {
  readonly type = AccountTagsActionTypes.UpdateTag;

  constructor(readonly payload: TagUpdatingParams) {}
}

export class UpdateTagSuccess implements Action {
  readonly type = AccountTagsActionTypes.UpdateTagSuccess;

  constructor(readonly payload: TagUpdatingParams) {}
}

export class UpdateTagError implements Action {
  readonly type = AccountTagsActionTypes.UpdateTagError;

  constructor(readonly payload: { error: Error }) {}
}

export class CreateTag implements Action {
  readonly type = AccountTagsActionTypes.CreateTag;

  constructor(readonly payload: TagCreationParams) {}
}

export class CreateTagSuccess implements Action {
  readonly type = AccountTagsActionTypes.CreateTagSuccess;

  constructor(readonly payload: TagCreationParams) {}
}

export class CreateTagError implements Action {
  readonly type = UserTagsActionTypes.CreateTagError;

  constructor(readonly payload: { error: Error }) {}
}

export class DeleteTag implements Action {
  readonly type = AccountTagsActionTypes.DeleteTag;

  constructor(readonly payload: string) {}
}

export class DeleteTagSuccess implements Action {
  readonly type = AccountTagsActionTypes.DeleteTagSuccess;

  constructor(readonly payload: string) {}
}

export class DeleteTagError implements Action {
  readonly type = AccountTagsActionTypes.DeleteTagError;

  constructor(readonly payload: { error: Error }) {}
}

export type Actions =
  | LoadAccountTagsRequest
  | UpdateAccountTagsFilter
  | LoadAccountTagsResponse
  | UpdateTag
  | UpdateTagSuccess
  | UpdateTagError
  | DeleteTag
  | DeleteTagSuccess
  | DeleteTagError
  | CreateTag
  | CreateTagSuccess
  | CreateTagError;
