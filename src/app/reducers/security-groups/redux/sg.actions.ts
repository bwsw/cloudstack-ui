import { Action } from '@ngrx/store';
import { SecurityGroup, SecurityGroupNative } from '../../../security-group/sg.model';
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
export const CONVERT_SECURITY_GROUP =
  '[Security Groups list] Convert private security group to shared';
export const CONVERT_SECURITY_GROUP_SUCCESS =
  '[Security Groups list] Convert private security group to shared success';
export const CONVERT_SECURITY_GROUP_ERROR =
  '[Security Groups list] Convert private security group to shared error';

export class LoadSecurityGroupRequest implements Action {
  readonly type = LOAD_SECURITY_GROUP_REQUEST;

  constructor(readonly payload?: any) {}
}

export class LoadSecurityGroupResponse implements Action {
  readonly type = LOAD_SECURITY_GROUP_RESPONSE;

  constructor(readonly payload: SecurityGroup[]) {}
}

export class SecurityGroupFilterUpdate implements Action {
  readonly type = SECURITY_GROUP_FILTER_UPDATE;

  constructor(readonly payload?: any) {}
}

export class LoadSelectedSecurityGroup implements Action {
  readonly type = LOAD_SELECTED_SECURITY_GROUP;

  constructor(readonly payload: string) {}
}

export class CreateSecurityGroup implements Action {
  readonly type = CREATE_SECURITY_GROUP;

  constructor(readonly payload: SecurityGroupCreationParams) {}
}

export class CreateSecurityGroupSuccess implements Action {
  readonly type = CREATE_SECURITY_GROUP_SUCCESS;

  constructor(readonly payload: SecurityGroup) {}
}

export class CreateSecurityGroupsSuccess implements Action {
  readonly type = CREATE_SECURITY_GROUPS_SUCCESS;

  constructor(readonly payload: SecurityGroup[]) {}
}

export class CreateSecurityGroupError implements Action {
  readonly type = CREATE_SECURITY_GROUP_ERROR;

  constructor(readonly payload: Error) {}
}

export class UpdateSecurityGroup implements Action {
  readonly type = UPDATE_SECURITY_GROUP;

  constructor(readonly payload: SecurityGroup) {}
}

export class DeleteSecurityGroup implements Action {
  readonly type = DELETE_SECURITY_GROUP;

  constructor(readonly payload: SecurityGroup) {}
}

export class DeletePrivateSecurityGroup implements Action {
  readonly type = DELETE_PRIVATE_SECURITY_GROUP;

  constructor(readonly payload: VirtualMachine) {}
}

export class DeleteSecurityGroupSuccess implements Action {
  readonly type = DELETE_SECURITY_GROUP_SUCCESS;

  constructor(readonly payload: SecurityGroup) {}
}

export class DeleteSecurityGroupError implements Action {
  readonly type = DELETE_SECURITY_GROUP_ERROR;

  constructor(readonly payload: Error) {}
}

export class ConvertSecurityGroup implements Action {
  readonly type = CONVERT_SECURITY_GROUP;

  constructor(readonly payload: SecurityGroupNative) {}
}

export class ConvertSecurityGroupSuccess implements Action {
  readonly type = CONVERT_SECURITY_GROUP_SUCCESS;

  constructor(readonly payload: SecurityGroupNative) {}
}

export class ConvertSecurityGroupError implements Action {
  readonly type = CONVERT_SECURITY_GROUP_ERROR;

  constructor(readonly payload: Error) {}
}

export class UpdateSecurityGroupError implements Action {
  readonly type = UPDATE_SECURITY_GROUP_ERROR;

  constructor(readonly payload: Error) {}
}

export type Actions =
  | LoadSecurityGroupRequest
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
  | ConvertSecurityGroup
  | ConvertSecurityGroupSuccess
  | ConvertSecurityGroupError;
