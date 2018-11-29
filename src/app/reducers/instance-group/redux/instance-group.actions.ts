import { Action } from '@ngrx/store';
import { InstanceGroup } from '../../../shared/models';

export enum InstanceGroupActionTypes {
  LOAD_INSTANCE_GROUPS_REQUEST = '[Instance groups] LOAD_INSTANCE_GROUPS_REQUEST',
  LOAD_INSTANCE_GROUPS_RESPONSE = '[Instance groups] LOAD_INSTANCE_GROUPS_RESPONSE',
  LOAD_INSTANCE_GROUPS_ERROR = '[Instance groups] LOAD_INSTANCE_GROUPS_ERROR',
}

export class LoadInstanceGroupsRequest implements Action {
  readonly type = InstanceGroupActionTypes.LOAD_INSTANCE_GROUPS_REQUEST;
}

export class LoadInstanceGroupsResponse implements Action {
  readonly type = InstanceGroupActionTypes.LOAD_INSTANCE_GROUPS_RESPONSE;

  constructor(public payload: InstanceGroup[]) {}
}

export class LoadInstanceGroupsError implements Action {
  readonly type = InstanceGroupActionTypes.LOAD_INSTANCE_GROUPS_ERROR;

  constructor(public payload: Error) {}
}

export type Actions =
  | LoadInstanceGroupsRequest
  | LoadInstanceGroupsResponse
  | LoadInstanceGroupsError;
