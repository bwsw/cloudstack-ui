import { Action } from '@ngrx/store';
import { VmLog } from '../models/vm-log.model';
import { Keyword } from '../models/keyword.model';
import { Time } from '../../shared/components/time-picker/time-picker.component';
import { DateObject } from '../models/date-object.model';
import { VmLogFile } from '../models/vm-log-file.model';

export enum VmLogsActionTypes {
  LOAD_VM_LOGS_REQUEST = '[VM Logs] LOAD_VM_LOGS_REQUEST',
  LOAD_VM_LOGS_RESPONSE = '[VM Logs] LOAD_VM_LOGS_RESPONSE',
  LOAD_VM_LOG_FILES_REQUEST = '[VM Logs] LOAD_VM_LOG_FILES_REQUEST',
  LOAD_VM_LOG_FILES_RESPONSE = '[VM Logs] LOAD_VM_LOG_FILES_RESPONSE',
  VM_LOGS_UPDATE_KEYWORDS = '[VM Logs] VM_LOGS_UPDATE_KEYWORDS',
  VM_LOGS_ADD_KEYWORD = '[VM Logs] VM_LOGS_ADD_KEYWORD',
  VM_LOGS_REMOVE_KEYWORD = '[VM Logs] VM_LOGS_REMOVE_KEYWORD',
  VM_LOGS_UPDATE_START_DATE_TIME = '[VM Logs] VM_LOGS_UPDATE_START_DATE_TIME',
  VM_LOGS_UPDATE_START_DATE = '[VM Logs] VM_LOGS_UPDATE_START_DATE',
  VM_LOGS_UPDATE_START_TIME = '[VM Logs] VM_LOGS_UPDATE_START_TIME',
  VM_LOGS_UPDATE_END_DATE_TIME = '[VM Logs] VM_LOGS_UPDATE_END_DATE_TIME',
  VM_LOGS_UPDATE_END_DATE = '[VM Logs] VM_LOGS_UPDATE_END_DATE',
  VM_LOGS_UPDATE_END_TIME = '[VM Logs] VM_LOGS_UPDATE_END_TIME',
  VM_LOGS_UPDATE_ACCOUNT_IDS = '[VM Logs] VM_LOGS_UPDATE_ACCOUNT_IDS',
  VM_LOGS_UPDATE_NEWEST_FIRST = '[VM Logs] VM_LOGS_UPDATE_NEWEST_FIRST',
  VM_LOGS_TOGGLE_NEWEST_FIRST = '[VM Logs] VM_LOGS_TOGGLE_NEWEST_FIRST',
  VM_LOGS_UPDATE_VM_ID = '[VM_LOGS] VM_LOGS_UPDATE_VM_ID',
  VM_LOGS_UPDATE_LOG_FILE = '[VM Logs] VM_LOGS_UPDATE_LOG_FILE',
}

export class LoadVmLogsRequest implements Action {
  readonly type = VmLogsActionTypes.LOAD_VM_LOGS_REQUEST;
}

export class LoadVmLogsResponse implements Action {
  readonly type = VmLogsActionTypes.LOAD_VM_LOGS_RESPONSE;

  constructor(readonly payload: VmLog[]) {}
}

export class LoadVmLogFilesRequest implements Action {
  readonly type = VmLogsActionTypes.LOAD_VM_LOG_FILES_REQUEST;

  constructor(public payload?: never) {}
}

export class LoadVmLogFilesResponse implements Action {
  readonly type = VmLogsActionTypes.LOAD_VM_LOG_FILES_RESPONSE;

  constructor(public payload: VmLogFile[]) {}
}

export class VmLogsUpdateKeywords implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_UPDATE_KEYWORDS;

  constructor(public payload: any) {}
}

export class VmLogsAddKeyword implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_ADD_KEYWORD;

  constructor(readonly payload: Keyword) {}
}

export class VmLogsRemoveKeyword implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_REMOVE_KEYWORD;

  constructor(readonly payload: Keyword) {}
}

export class VmLogsUpdateStartDateTime implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_UPDATE_START_DATE_TIME;

  constructor(public payload: DateObject) {}
}

export class VmLogsUpdateStartDate implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_UPDATE_START_DATE;

  constructor(readonly payload: Date) {}
}

export class VmLogsUpdateStartTime implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_UPDATE_START_TIME;

  constructor(readonly payload: Time) {}
}

export class VmLogsUpdateEndDateTime implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_UPDATE_END_DATE_TIME;

  constructor(public payload: DateObject) {}
}

export class VmLogsUpdateEndDate implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_UPDATE_END_DATE;

  constructor(readonly payload: Date) {}
}

export class VmLogsUpdateEndTime implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_UPDATE_END_TIME;

  constructor(readonly payload: Time) {}
}

export class VmLogsUpdateVmId implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_UPDATE_VM_ID;

  constructor(public payload: string) {}
}

export class VmLogsUpdateAccountIds implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_UPDATE_ACCOUNT_IDS;

  constructor(readonly payload: string[]) {}
}

export class VmLogsUpdateNewestFirst implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_UPDATE_NEWEST_FIRST;

  constructor(readonly payload: boolean) {}
}

export class VmLogsToggleNewestFirst implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_TOGGLE_NEWEST_FIRST;
}

export class VmLogsUpdateLogFile implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_UPDATE_LOG_FILE;

  constructor(public payload: string) {}
}

export type Actions =
  | LoadVmLogsResponse
  | LoadVmLogsRequest
  | LoadVmLogFilesRequest
  | LoadVmLogFilesResponse
  | VmLogsUpdateKeywords
  | VmLogsAddKeyword
  | VmLogsRemoveKeyword
  | VmLogsUpdateVmId
  | VmLogsUpdateAccountIds
  | VmLogsUpdateStartDateTime
  | VmLogsUpdateStartDate
  | VmLogsUpdateStartTime
  | VmLogsUpdateEndDateTime
  | VmLogsUpdateEndDate
  | VmLogsUpdateEndTime
  | VmLogsUpdateLogFile
  | VmLogsUpdateNewestFirst
  | VmLogsToggleNewestFirst;
