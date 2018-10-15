import { Action } from '@ngrx/store';
import { VmLog } from '../models/vm-log.model';

export const LOAD_VM_LOGS_REQUEST = '[VM Logs] LOAD_VM_LOGS_REQUEST';
export const LOAD_VM_LOGS_RESPONSE = '[VM Logs] LOAD_VM_LOGS_RESPONSE';
export const VM_LOGS_FILTER_UPDATE = '[VM Logs] VM_LOGS_FILTER_UPDATE';
export const VM_LOGS_ADD_KEYWORD = '[VM Logs] VM_LOGS_ADD_KEYWORD';
export const VM_LOGS_REMOVE_KEYWORD = '[VM Logs] VM_LOGS_REMOVE_KEYWORD';
export const VM_LOGS_UPDATE_START_DATE = '[VM Logs] VM_LOGS_UPDATE_START_DATE';
export const VM_LOGS_UPDATE_START_TIME = '[VM Logs] VM_LOGS_UPDATE_START_TIME';
export const VM_LOGS_UPDATE_END_DATE = '[VM Logs] VM_LOGS_UPDATE_END_DATE';
export const VM_LOGS_UPDATE_END_TIME = '[VM Logs] VM_LOGS_UPDATE_END_TIME';
export const VM_LOGS_UPDATE_ACCOUNT_IDS = '[VM Logs] VM_LOGS_UPDATE_ACCOUNT_IDS';

export class LoadVmLogsRequest implements Action {
  type = LOAD_VM_LOGS_REQUEST;

  constructor(public payload?: any) {
  }

}

export class LoadVmLogsResponse implements Action {
  type = LOAD_VM_LOGS_RESPONSE;

  constructor(public payload: Array<VmLog> | any) {
  }

}

export class VmLogsFilterUpdate implements Action {
  type = VM_LOGS_FILTER_UPDATE;

  constructor(public payload: any) {
  }

}

export class VmLogsAddKeyword implements Action {
  type = VM_LOGS_ADD_KEYWORD;

  constructor(public payload: any) {
  }
}

export class VmLogsRemoveKeyword implements Action {
  type = VM_LOGS_REMOVE_KEYWORD;

  constructor(public payload: any) {
  }
}

export class VmLogsUpdateStartDate implements Action {
  type = VM_LOGS_UPDATE_START_DATE;

  constructor(public payload: any) {
  }
}

export class VmLogsUpdateStartTime implements Action {
  type = VM_LOGS_UPDATE_START_TIME;

  constructor(public payload: any) {
  }
}

export class VmLogsUpdateEndDate implements Action {
  type = VM_LOGS_UPDATE_END_DATE;

  constructor(public payload: any) {
  }
}

export class VmLogsUpdateEndTime implements Action {
  type = VM_LOGS_UPDATE_END_TIME;

  constructor(public payload: any) {
  }
}

export class VmLogsUpdateAccountIds implements Action {
  type = VM_LOGS_UPDATE_ACCOUNT_IDS;

  constructor(public payload: any) {
  }
}

export type Actions =
  LoadVmLogsResponse
  | LoadVmLogsRequest
  | VmLogsFilterUpdate
  | VmLogsAddKeyword
  | VmLogsRemoveKeyword
  | VmLogsUpdateAccountIds;
