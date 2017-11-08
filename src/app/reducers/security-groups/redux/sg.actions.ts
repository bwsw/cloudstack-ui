import { Action } from '@ngrx/store';

export const LOAD_SG_REQUEST = '[SecurityGroups] LOAD_SG_REQUEST';
export const LOAD_SG_RESPONSE = '[SecurityGroups] LOAD_SG_RESPONSE';
export const SG_FILTER_UPDATE = '[SecurityGroups] SG_FILTER_UPDATE';
export const LOAD_SELECTED_SG = '[SecurityGroups] LOAD_SELECTED_SG';

export class LoadSGRequest implements Action {
  readonly type = LOAD_SG_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadSGResponse implements Action {
  readonly type = LOAD_SG_RESPONSE;

  constructor(public payload: any) {
  }
}

export class SGFilterUpdate implements Action {
  readonly type = SG_FILTER_UPDATE;

  constructor(public payload?: any) {
  }
}

export class LoadSelectedSG implements Action {
  type = LOAD_SELECTED_SG;

  constructor(public payload: string) {
  }

}

export type Actions =
  LoadSGRequest
  | LoadSGResponse
  | SGFilterUpdate
  | LoadSelectedSG;
