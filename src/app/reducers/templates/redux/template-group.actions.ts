import { Action } from '@ngrx/store';
import { TemplateGroup } from '../../../shared/models/template-group.model';

export const LOAD_TEMPLATE_GROUP_REQUEST = '[TemplateGroups] LOAD_TEMPLATE_GROUP_REQUEST';
export const LOAD_TEMPLATE_GROUP_RESPONSE = '[TemplateGroups] LOAD_TEMPLATE_GROUP_RESPONSE';

export class LoadTemplateGroupsRequest implements Action {
  readonly type = LOAD_TEMPLATE_GROUP_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadTemplateGroupsResponse implements Action {
  readonly type = LOAD_TEMPLATE_GROUP_RESPONSE;

  constructor(public payload: TemplateGroup[]) {
  }
}

export type Actions = LoadTemplateGroupsRequest | LoadTemplateGroupsResponse


