import { Action } from '@ngrx/store';

export const LOAD_RESOURCE_LIMITS_REQUEST = '[RESOURCE_LIMITS] LOAD_RESOURCE_LIMITS_REQUEST';
export const LOAD_RESOURCE_LIMITS_RESPONSE = '[RESOURCE_LIMITS] LOAD_RESOURCE_LIMITS_RESPONSE';
export const UPDATE_RESOURCE_LIMITS_REQUEST = '[RESOURCE_LIMITS] UPDATE_RESOURCE_LIMITS_REQUEST';

export class LoadResourceLimitsRequest implements Action {
  type = LOAD_RESOURCE_LIMITS_REQUEST;

  constructor(public payload?: any) {
  }

}

export class LoadResourceLimitsResponse implements Action {
  type = LOAD_RESOURCE_LIMITS_RESPONSE;

  constructor(public payload:  any ) {
  }

}

export class UpdateResourceLimitsRequest implements Action {
  type = UPDATE_RESOURCE_LIMITS_REQUEST;

  constructor(public payload:  { limits: any[], account: any } ) {
  }

}

export type Actions = LoadResourceLimitsResponse | LoadResourceLimitsRequest | UpdateResourceLimitsRequest;
