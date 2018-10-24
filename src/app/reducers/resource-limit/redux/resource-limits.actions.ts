import { Action } from '@ngrx/store';
import { ResourceLimit } from '../../../shared/models';

export const LOAD_RESOURCE_LIMITS_REQUEST = '[RESOURCE_LIMITS] LOAD_RESOURCE_LIMITS_REQUEST';
export const LOAD_RESOURCE_LIMITS_RESPONSE = '[RESOURCE_LIMITS] LOAD_RESOURCE_LIMITS_RESPONSE';
export const UPDATE_RESOURCE_LIMITS_REQUEST = '[RESOURCE_LIMITS] UPDATE_RESOURCE_LIMITS_REQUEST';
export const UPDATE_RESOURCE_LIMITS_ERROR = '[RESOURCE_LIMITS] UPDATE_RESOURCE_LIMITS_ERROR';

export class LoadResourceLimitsRequest implements Action {
  type = LOAD_RESOURCE_LIMITS_REQUEST;

  constructor(public payload: { account: string; domainid: string }) {}
}

export class LoadResourceLimitsResponse implements Action {
  type = LOAD_RESOURCE_LIMITS_RESPONSE;

  constructor(public payload: any) {}
}

export class UpdateResourceLimitsRequest implements Action {
  type = UPDATE_RESOURCE_LIMITS_REQUEST;

  constructor(public payload: ResourceLimit[]) {}
}

export class UpdateResourceLimitsError implements Action {
  readonly type = UPDATE_RESOURCE_LIMITS_ERROR;

  constructor(public payload: Error) {}
}

export type Actions =
  | LoadResourceLimitsResponse
  | LoadResourceLimitsRequest
  | UpdateResourceLimitsRequest
  | UpdateResourceLimitsError;
