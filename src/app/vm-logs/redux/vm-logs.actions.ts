import { Action } from '@ngrx/store';
import { VmLog } from '../models/vm-log.model';
import { Keyword } from '../models/keyword.model';
import { Time } from '../../shared/components/time-picker/time-picker.component';
import { VmLogsFilters } from './vm-logs.reducers';

export enum VmLogsActionTypes {
  LOAD_VM_LOGS_REQUEST = '[VM Logs] LOAD_VM_LOGS_REQUEST',
  LOAD_VM_LOGS_RESPONSE = '[VM Logs] LOAD_VM_LOGS_RESPONSE',
  VM_LOGS_FILTER_UPDATE = '[VM Logs] VM_LOGS_FILTER_UPDATE',
  VM_LOGS_ADD_KEYWORD = '[VM Logs] VM_LOGS_ADD_KEYWORD',
  VM_LOGS_REMOVE_KEYWORD = '[VM Logs] VM_LOGS_REMOVE_KEYWORD',
  VM_LOGS_UPDATE_START_DATE = '[VM Logs] VM_LOGS_UPDATE_START_DATE',
  VM_LOGS_UPDATE_START_TIME = '[VM Logs] VM_LOGS_UPDATE_START_TIME',
  VM_LOGS_UPDATE_END_DATE = '[VM Logs] VM_LOGS_UPDATE_END_DATE',
  VM_LOGS_UPDATE_END_TIME = '[VM Logs] VM_LOGS_UPDATE_END_TIME',
  VM_LOGS_UPDATE_ACCOUNT_IDS = '[VM Logs] VM_LOGS_UPDATE_ACCOUNT_IDS',
  VM_LOGS_TOGGLE_NEWEST_FIRST = '[VM Logs] VM_LOGS_TOGGLE_NEWEST_FIRST'
}

export class LoadVmLogsRequest implements Action {
  readonly type = VmLogsActionTypes.LOAD_VM_LOGS_REQUEST;
}

export class LoadVmLogsResponse implements Action {
  readonly type = VmLogsActionTypes.LOAD_VM_LOGS_RESPONSE;

  constructor(readonly payload: Array<VmLog>) {
  }
}

export class VmLogsFilterUpdate implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_FILTER_UPDATE;

  constructor(readonly payload: Partial<VmLogsFilters>) {
  }
}

export class VmLogsAddKeyword implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_ADD_KEYWORD;

  constructor(readonly payload: Keyword) {
  }
}

export class VmLogsRemoveKeyword implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_REMOVE_KEYWORD;

  constructor(readonly payload: Keyword) {
  }
}

export class VmLogsUpdateStartDate implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_UPDATE_START_DATE;

  constructor(readonly payload: Date) {
  }
}

export class VmLogsUpdateStartTime implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_UPDATE_START_TIME;

  constructor(readonly payload: Time) {
  }
}

export class VmLogsUpdateEndDate implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_UPDATE_END_DATE;

  constructor(readonly payload: Date) {
  }
}

export class VmLogsUpdateEndTime implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_UPDATE_END_TIME;

  constructor(readonly payload: Time) {
  }
}

export class VmLogsUpdateAccountIds implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_UPDATE_ACCOUNT_IDS;

  constructor(readonly payload: Array<string>) {
  }
}

export class VmLogsToggleNewestFirst implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_TOGGLE_NEWEST_FIRST;
}

export type Actions =
  LoadVmLogsResponse
  | LoadVmLogsRequest
  | VmLogsFilterUpdate
  | VmLogsAddKeyword
  | VmLogsUpdateStartDate
  | VmLogsUpdateStartTime
  | VmLogsUpdateEndDate
  | VmLogsUpdateEndTime
  | VmLogsRemoveKeyword
  | VmLogsUpdateAccountIds
  | VmLogsToggleNewestFirst;
