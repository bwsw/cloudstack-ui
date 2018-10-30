import { Action } from '@ngrx/store';

export const LOAD_CONFIGURATIONS_REQUEST = '[CONFIGURATIONS] LOAD_CONFIGURATIONS_REQUEST';
export const LOAD_CONFIGURATIONS_RESPONSE = '[CONFIGURATIONS] LOAD_CONFIGURATIONS_RESPONSE';
export const UPDATE_CONFIGURATIONS_REQUEST = '[CONFIGURATIONS] UPDATE_CONFIGURATIONS_REQUEST';
export const UPDATE_CONFIGURATIONS_ERROR = '[CONFIGURATIONS] UPDATE_CONFIGURATIONS_ERROR';

export class LoadConfigurationsRequest implements Action {
  type = LOAD_CONFIGURATIONS_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadConfigurationsResponse implements Action {
  type = LOAD_CONFIGURATIONS_RESPONSE;

  constructor(public payload: any) {}
}

export class UpdateConfigurationRequest implements Action {
  type = UPDATE_CONFIGURATIONS_REQUEST;

  constructor(public payload: any) {}
}

export class UpdateConfigurationError implements Action {
  readonly type = UPDATE_CONFIGURATIONS_ERROR;

  constructor(public payload: Error) {}
}

export type Actions =
  | LoadConfigurationsRequest
  | LoadConfigurationsResponse
  | UpdateConfigurationRequest
  | UpdateConfigurationError;
