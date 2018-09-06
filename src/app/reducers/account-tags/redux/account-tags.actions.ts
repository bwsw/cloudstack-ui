import { Action } from '@ngrx/store';
import { Tag } from '../../../shared/models/tag.model';

export const LOAD_ACCOUNT_TAGS_REQUEST = '[ACCOUNT_TAGS] LOAD_ACCOUNT_TAGS_REQUEST';
export const LOAD_ACCOUNT_TAGS_RESPONSE = '[ACCOUNT_TAGS] LOAD_ACCOUNT_TAGS_RESPONSE';


export class LoadAccountTagsRequest implements Action {
  type = LOAD_ACCOUNT_TAGS_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadAccountTagsResponse implements Action {
  type = LOAD_ACCOUNT_TAGS_RESPONSE;

  constructor(public payload: Tag[]) {
  }
}

export type Actions = LoadAccountTagsRequest
  | LoadAccountTagsResponse;
