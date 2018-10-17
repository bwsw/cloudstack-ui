import { Action } from '@ngrx/store';
import { VmLog } from '../models/vm-log.model';
import { VmLogFile } from '../models/vm-log-file.model';

export const LOAD_VM_LOGS_REQUEST = '[VM Logs] LOAD_VM_LOGS_REQUEST';
export const LOAD_VM_LOGS_RESPONSE = '[VM Logs] LOAD_VM_LOGS_RESPONSE';
export const LOAD_VM_LOG_FILES_REQUEST = '[VM Logs] LOAD_VM_LOG_FILES_REQUEST';
export const LOAD_VM_LOG_FILES_RESPONSE = '[VM Logs] LOAD_VM_LOG_FILES_RESPONSE';
export const VM_LOGS_UPDATE_KEYWORDS = '[VM Logs] VM_LOGS_UPDATE_KEYWORDS';
export const VM_LOGS_ADD_KEYWORD = '[VM Logs] VM_LOGS_ADD_KEYWORD';
export const VM_LOGS_REMOVE_KEYWORD = '[VM Logs] VM_LOGS_REMOVE_KEYWORD';
export const VM_LOGS_UPDATE_START_DATE_TIME = '[VM Logs] VM_LOGS_UPDATE_START_DATE_TIME';
export const VM_LOGS_UPDATE_START_DATE = '[VM Logs] VM_LOGS_UPDATE_START_DATE';
export const VM_LOGS_UPDATE_START_TIME = '[VM Logs] VM_LOGS_UPDATE_START_TIME';
export const VM_LOGS_UPDATE_END_DATE_TIME = '[VM Logs] VM_LOGS_UPDATE_END_DATE_TIME';
export const VM_LOGS_UPDATE_END_DATE = '[VM Logs] VM_LOGS_UPDATE_END_DATE';
export const VM_LOGS_UPDATE_END_TIME = '[VM Logs] VM_LOGS_UPDATE_END_TIME';
export const VM_LOGS_UPDATE_VM_ID = '[VM_LOGS] VM_LOGS_UPDATE_VM_ID';
export const VM_LOGS_UPDATE_ACCOUNT_IDS = '[VM Logs] VM_LOGS_UPDATE_ACCOUNT_IDS';
export const VM_LOGS_UPDATE_LOG_FILE = '[VM Logs] VM_LOGS_UPDATE_LOG_FILE';

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

export class LoadVmLogFilesRequest implements Action {
  type = LOAD_VM_LOG_FILES_REQUEST;

  constructor(public payload?: never) {
  }
}

export class LoadVmLogFilesResponse implements Action {
  type = LOAD_VM_LOG_FILES_RESPONSE;

  constructor(public payload: Array<VmLogFile>) {
  }
}

export class VmLogsUpdateKeywords implements Action {
  type = VM_LOGS_UPDATE_KEYWORDS;

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

export class VmLogsUpdateStartDateTime implements Action {
  type = VM_LOGS_UPDATE_START_DATE_TIME;

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

export class VmLogsUpdateEndDateTime implements Action {
  type = VM_LOGS_UPDATE_END_DATE_TIME;

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

export class VmLogsUpdateVmId implements Action {
  type = VM_LOGS_UPDATE_VM_ID;

  constructor(public payload: any) {
  }
}

export class VmLogsUpdateAccountIds implements Action {
  type = VM_LOGS_UPDATE_ACCOUNT_IDS;

  constructor(public payload: any) {
  }
}

export class VmLogsUpdateLogFile implements Action {
  type = VM_LOGS_UPDATE_LOG_FILE;

  constructor(public payload: any) {
  }
}

export type Actions =
  LoadVmLogsResponse
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
  | VmLogsUpdateLogFile;
