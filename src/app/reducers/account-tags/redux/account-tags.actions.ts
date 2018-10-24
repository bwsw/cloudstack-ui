import { Action } from '@ngrx/store';
import { Tag } from '../../../shared/models';

export const LOAD_ACCOUNT_TAGS_REQUEST = '[ACCOUNT_TAGS] LOAD_ACCOUNT_TAGS_REQUEST';
export const LOAD_ACCOUNT_TAGS_RESPONSE = '[ACCOUNT_TAGS] LOAD_ACCOUNT_TAGS_RESPONSE';

export class LoadAccountTagsRequest implements Action {
  readonly type = LOAD_ACCOUNT_TAGS_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadAccountTagsResponse implements Action {
  readonly type = LOAD_ACCOUNT_TAGS_RESPONSE;

  constructor(readonly payload: Tag[]) {}
}

export type Actions = LoadAccountTagsRequest | LoadAccountTagsResponse;
