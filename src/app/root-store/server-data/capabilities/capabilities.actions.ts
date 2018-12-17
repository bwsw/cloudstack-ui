import { Action } from '@ngrx/store';
import { Capabilities } from '../../../shared/models';

export enum ActionTypes {
  LoadCapabilities = '[App Initializer] Load capabilities',
  LoadCapabilitiesSuccess = '[Capabilities API] Load capabilities success',
  LoadCapabilitiesError = '[Capabilities API] Load capabilities error',
}

export class LoadCapabilities implements Action {
  readonly type = ActionTypes.LoadCapabilities;
}

export class LoadCapabilitiesSuccess implements Action {
  readonly type = ActionTypes.LoadCapabilitiesSuccess;

  constructor(readonly payload: Capabilities) {}
}

export class LoadCapabilitiesError implements Action {
  readonly type = ActionTypes.LoadCapabilitiesError;
}

export type Actions = LoadCapabilities | LoadCapabilitiesSuccess | LoadCapabilitiesError;
