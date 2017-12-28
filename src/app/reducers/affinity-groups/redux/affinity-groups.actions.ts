import { Action } from '@ngrx/store';
import { AffinityGroup } from '../../../shared/models';

export const LOAD_AFFINITY_GROUPS_REQUEST = '[AFFINITY GROUPS] LOAD_AFFINITY_GROUPS_REQUEST';
export const LOAD_AFFINITY_GROUPS_RESPONSE = '[AFFINITY GROUPS] LOAD_AFFINITY_GROUPS_RESPONSE';

export class LoadAffinityGroupsRequest implements Action {
  type = LOAD_AFFINITY_GROUPS_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadAffinityGroupsResponse implements Action {
  type = LOAD_AFFINITY_GROUPS_RESPONSE;

  constructor(public payload: Array<AffinityGroup>) {
  }
}

export type Actions = LoadAffinityGroupsRequest | LoadAffinityGroupsResponse;
