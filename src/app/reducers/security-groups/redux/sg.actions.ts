import { Action } from '@ngrx/store';
import { SecurityGroup } from '../../../security-group/sg.model';
import { SecurityGroupCreationParams } from '../../../security-group/sg-creation/security-group-creation.component';
import { VirtualMachine } from '../../../vm/shared/vm.model';

export const LOAD_SECURITY_GROUP_REQUEST = '[SecurityGroups] LOAD_SECURITY_GROUP_REQUEST';
export const LOAD_SECURITY_GROUP_RESPONSE = '[SecurityGroups] LOAD_SECURITY_GROUP_RESPONSE';
export const SECURITY_GROUP_FILTER_UPDATE = '[SecurityGroups] SECURITY_GROUP_FILTER_UPDATE';
export const LOAD_SELECTED_SECURITY_GROUP = '[SecurityGroups] LOAD_SELECTED_SECURITY_GROUP';
export const CREATE_SECURITY_GROUP = '[SecurityGroups] CREATE_SECURITY_GROUP';
export const CREATE_SECURITY_GROUP_SUCCESS = '[SecurityGroups] CREATE_SECURITY_GROUP_SUCCESS';
export const CREATE_SECURITY_GROUPS_SUCCESS = '[SecurityGroups] CREATE_SECURITY_GROUPS_SUCCESS';
export const CREATE_SECURITY_GROUP_ERROR = '[SecurityGroups] CREATE_SECURITY_GROUP_ERROR';
export const UPDATE_SECURITY_GROUP = '[SecurityGroups] UPDATE_SECURITY_GROUP';
export const UPDATE_SECURITY_GROUP_ERROR = '[SecurityGroups] UPDATE_SECURITY_GROUP_ERROR';
export const DELETE_SECURITY_GROUP = '[SecurityGroups] DELETE_SECURITY_GROUP';
export const DELETE_PRIVATE_SECURITY_GROUP = '[SecurityGroups] DELETE_PRIVATE_SECURITY_GROUP';
export const DELETE_SECURITY_GROUP_SUCCESS = '[SecurityGroups] DELETE_SECURITY_GROUP_SUCCESS';
export const DELETE_SECURITY_GROUP_ERROR = '[SecurityGroups] DELETE_SECURITY_GROUP_ERROR';
export const CONVERT_SECURITY_GROUP = '[SecurityGroups] CONVERT_SECURITY_GROUP';

export class LoadSecurityGroupRequest implements Action {
  readonly type = LOAD_SECURITY_GROUP_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadSecurityGroupResponse implements Action {
  readonly type = LOAD_SECURITY_GROUP_RESPONSE;

  constructor(public payload: SecurityGroup[]) {
  }
}

export class SecurityGroupFilterUpdate implements Action {
  readonly type = SECURITY_GROUP_FILTER_UPDATE;

  constructor(public payload?: any) {
  }
}

export class LoadSelectedSecurityGroup implements Action {
  type = LOAD_SELECTED_SECURITY_GROUP;

  constructor(public payload: string) {
  }
}

export class CreateSecurityGroup implements Action {
  type = CREATE_SECURITY_GROUP;

  constructor(public payload: SecurityGroupCreationParams) {
  }
}

export class CreateSecurityGroupSuccess implements Action {
  type = CREATE_SECURITY_GROUP_SUCCESS;

  constructor(public payload: SecurityGroup) {
  }
}

export class CreateSecurityGroupsSuccess implements Action {
  type = CREATE_SECURITY_GROUPS_SUCCESS;

  constructor(public payload: SecurityGroup[]) {
  }
}

export class CreateSecurityGroupError implements Action {
  type = CREATE_SECURITY_GROUP_ERROR;

  constructor(public payload: any) {
  }
}

export class UpdateSecurityGroup implements Action {
  type = UPDATE_SECURITY_GROUP;

  constructor(public payload: SecurityGroup) {
  }
}

export class DeleteSecurityGroup implements Action {
  type = DELETE_SECURITY_GROUP;

  constructor(public payload: SecurityGroup) {
  }
}

export class DeletePrivateSecurityGroup implements Action {
  type = DELETE_PRIVATE_SECURITY_GROUP;

  constructor(public payload: VirtualMachine) {
  }
}

export class DeleteSecurityGroupSuccess implements Action {
  type = DELETE_SECURITY_GROUP_SUCCESS;

  constructor(public payload: SecurityGroup) {
  }
}

export class DeleteSecurityGroupError implements Action {
  type = DELETE_SECURITY_GROUP_ERROR;

  constructor(public payload: any) {
  }
}

export class ConvertSecurityGroup implements Action {
  type = CONVERT_SECURITY_GROUP;

  constructor(public payload: SecurityGroup) {
  }
}

export class UpdateSecurityGroupError implements Action {
  type = UPDATE_SECURITY_GROUP_ERROR;


  constructor(public payload: any) {
  }
}


export type Actions =
  LoadSecurityGroupRequest
  | LoadSecurityGroupResponse
  | SecurityGroupFilterUpdate
  | LoadSelectedSecurityGroup
  | CreateSecurityGroup
  | CreateSecurityGroupSuccess
  | CreateSecurityGroupsSuccess
  | CreateSecurityGroupError
  | UpdateSecurityGroup
  | DeleteSecurityGroup
  | DeletePrivateSecurityGroup
  | DeleteSecurityGroupSuccess
  | DeleteSecurityGroupError
  | ConvertSecurityGroup;
