import { Action } from '@ngrx/store';
import { Capabilities } from '../../../shared/models';

export enum ActionTypes {
  LOAD_CAPABILITIES_REQUEST = '[CAPABILITIES] LOAD_CAPABILITIES_REQUEST',
  LOAD_CAPABILITIES_RESPONSE = '[CAPABILITIES] LOAD_CAPABILITIES_RESPONSE',
  LOAD_CAPABILITIES_ERROR = '[CAPABILITIES] LOAD_CAPABILITIES_ERROR',
}

export class LoadCapabilitiesRequest implements Action {
  readonly type = ActionTypes.LOAD_CAPABILITIES_REQUEST;
}

export class LoadCapabilitiesResponse implements Action {
  readonly type = ActionTypes.LOAD_CAPABILITIES_RESPONSE;

  constructor(public payload: Capabilities) {}
}

export class LoadCapabilitiesError implements Action {
  readonly type = ActionTypes.LOAD_CAPABILITIES_ERROR;
}

export type Actions = LoadCapabilitiesRequest | LoadCapabilitiesResponse | LoadCapabilitiesError;
