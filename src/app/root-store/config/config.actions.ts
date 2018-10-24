import { Action } from '@ngrx/store';

import { Config } from '../../shared/models';

export enum ConfigActionTypes {
  LoadConfig = '[Effect initializing] Load config',
  LoadConfigSuccess = '[Http] Load config success',
  LoadConfigError = '[Http] Load config error',
}

export class LoadConfig implements Action {
  readonly type = ConfigActionTypes.LoadConfig;
}

export class LoadConfigSuccess implements Action {
  readonly type = ConfigActionTypes.LoadConfigSuccess;

  constructor(readonly payload: { config: Config }) {}
}

export class LoadConfigError implements Action {
  readonly type = ConfigActionTypes.LoadConfigError;

  constructor(readonly payload: { error: Error }) {}
}

export type ConfigActionsUnion = LoadConfig | LoadConfigSuccess | LoadConfigError;
