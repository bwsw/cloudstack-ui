import { Action } from '@ngrx/store';
import { AffinityGroup } from '../../../shared/models';

export const LOAD_AFFINITY_GROUPS_REQUEST = '[AFFINITY GROUPS] LOAD_AFFINITY_GROUPS_REQUEST';
export const LOAD_AFFINITY_GROUPS_RESPONSE = '[AFFINITY GROUPS] LOAD_AFFINITY_GROUPS_RESPONSE';
export const CREATE_AFFINITY_GROUP = '[AFFINITY GROUPS] CREATE_AFFINITY_GROUP';
export const CREATE_AFFINITY_GROUP_ERROR = '[AFFINITY GROUPS] CREATE_AFFINITY_GROUP_ERROR';
export const CREATE_AFFINITY_GROUP_SUCCESS = '[AFFINITY GROUPS] CREATE_AFFINITY_GROUP_SUCCESS';

export class LoadAffinityGroupsRequest implements Action {
  type = LOAD_AFFINITY_GROUPS_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadAffinityGroupsResponse implements Action {
  type = LOAD_AFFINITY_GROUPS_RESPONSE;

  constructor(public payload: AffinityGroup[]) {}
}

export class CreateAffinityGroup implements Action {
  type = CREATE_AFFINITY_GROUP;

  constructor(public payload: AffinityGroup) {}
}

export class CreateAffinityGroupError implements Action {
  type = CREATE_AFFINITY_GROUP_ERROR;

  constructor(public payload: Error) {}
}

export class CreateAffinityGroupSuccess implements Action {
  type = CREATE_AFFINITY_GROUP_SUCCESS;

  constructor(public payload: AffinityGroup) {}
}

export type Actions =
  | LoadAffinityGroupsRequest
  | LoadAffinityGroupsResponse
  | CreateAffinityGroup
  | CreateAffinityGroupSuccess
  | CreateAffinityGroupError;
