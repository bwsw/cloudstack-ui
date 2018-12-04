import { Action } from '@ngrx/store';
import { Capabilities } from '../../../shared/models/capabilities.model';

export enum ActionTypes {
  LOAD_CAPABILITIES_REQUEST = '[CAPABILITIES] LOAD_CAPABILITIES_REQUEST',
  LOAD_CAPABILITIES_RESPONSE = '[CONFIGURATIONS] LOAD_CAPABILITIES_RESPONSE',
}

export class LoadConfigurationsRequest implements Action {
  readonly type = ActionTypes.LOAD_CAPABILITIES_REQUEST;
}

export class LoadConfigurationsResponse implements Action {
  readonly type = ActionTypes.LOAD_CAPABILITIES_RESPONSE;

  constructor(public payload: Capabilities) {}
}

export type Actions = LoadConfigurationsRequest | LoadConfigurationsResponse;
