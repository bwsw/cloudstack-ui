import { Action } from '@ngrx/store';
import { VmLog } from '../models/vm-log.model';
import { Keyword } from '../models/keyword.model';
import { Time } from '../../shared/components/time-picker/time-picker.component';

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
export const VM_LOGS_TOGGLE_NEWEST_FIRST = '[VM Logs] VM_LOGS_TOGGLE_NEWEST_FIRST';

export class LoadVmLogsRequest implements Action {
  type = LOAD_VM_LOGS_REQUEST;

  constructor(public payload?: never) {
  }

}

export class LoadVmLogsResponse implements Action {
  type = LOAD_VM_LOGS_RESPONSE;

  constructor(public payload: Array<VmLog>) {
  }

}

export class VmLogsFilterUpdate implements Action {
  type = VM_LOGS_FILTER_UPDATE;

  constructor(public payload: { [key: string]: any }) { // todo: type this properly
  }

}

export class VmLogsAddKeyword implements Action {
  type = VM_LOGS_ADD_KEYWORD;

  constructor(public payload: Keyword) {
  }
}

export class VmLogsRemoveKeyword implements Action {
  type = VM_LOGS_REMOVE_KEYWORD;

  constructor(public payload: Keyword) {
  }
}

export class VmLogsUpdateStartDate implements Action {
  type = VM_LOGS_UPDATE_START_DATE;

  constructor(public payload: Date) {
  }
}

export class VmLogsUpdateStartTime implements Action {
  type = VM_LOGS_UPDATE_START_TIME;

  constructor(public payload: Time) {
  }
}

export class VmLogsUpdateEndDate implements Action {
  type = VM_LOGS_UPDATE_END_DATE;

  constructor(public payload: Date) {
  }
}

export class VmLogsUpdateEndTime implements Action {
  type = VM_LOGS_UPDATE_END_TIME;

  constructor(public payload: Time) {
  }
}

export class VmLogsUpdateAccountIds implements Action {
  type = VM_LOGS_UPDATE_ACCOUNT_IDS;

  constructor(public payload: Array<string>) {
  }
}

export class VmLogsToggleNewestFirst implements Action {
  type = VM_LOGS_TOGGLE_NEWEST_FIRST;

  constructor(public payload?: never) {
  }
}

export type Actions =
  LoadVmLogsResponse
  | LoadVmLogsRequest
  | VmLogsFilterUpdate
  | VmLogsAddKeyword
  | VmLogsRemoveKeyword
  | VmLogsUpdateAccountIds
  | VmLogsToggleNewestFirst;
