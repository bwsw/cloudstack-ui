import { Action } from '@ngrx/store';
import { SecurityGroup } from '../../../security-group/sg.model';

export const LOAD_SG_REQUEST = '[SecurityGroups] LOAD_SG_REQUEST';
export const LOAD_SG_RESPONSE = '[SecurityGroups] LOAD_SG_RESPONSE';
export const SG_FILTER_UPDATE = '[SecurityGroups] SG_FILTER_UPDATE';
export const LOAD_SELECTED_SG = '[SecurityGroups] LOAD_SELECTED_SG';
export const CREATE_SG_SUCCESS = '[SecurityGroups] CREATE_SG_SUCCESS';
export const REMOVE_SG_SUCCESS = '[SecurityGroups] REMOVE_SG_SUCCESS';
export const UPDATE_SECURITY_GROUP = '[SecurityGroups] UPDATE_SECURITY_GROUP';

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

export class CreateSGSuccess implements Action {
  type = CREATE_SG_SUCCESS;

  constructor(public payload: SecurityGroup) {
  }
}

export class RemoveSGSuccess implements Action {
  type = REMOVE_SG_SUCCESS;

  constructor(public payload: SecurityGroup) {
  }
}

export class UpdateSecurityGroup implements Action {
  type = UPDATE_SECURITY_GROUP;

  constructor(public payload: SecurityGroup) {
  }
}

export type Actions =
  LoadSGRequest
  | LoadSGResponse
  | SGFilterUpdate
  | LoadSelectedSG
  | CreateSGSuccess
  | RemoveSGSuccess
  | UpdateSecurityGroup;
