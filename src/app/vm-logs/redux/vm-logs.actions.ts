import { Action } from '@ngrx/store';
import { VmLog } from '../models/vm-log.model';
import { ScrollVmLogsList } from '../models/scroll-vm-logs-list';

export const LOAD_VM_LOGS_REQUEST = '[VM Logs] LOAD_VM_LOGS_REQUEST';
export const LOAD_VM_LOGS_SCROLL_REQUEST = '[VM Logs] LOAD_VM__LOGS_SCROLL_REQUEST';
export const LOAD_VM_LOGS_RESPONSE = '[VM Logs] LOAD_VM_LOGS_RESPONSE';
export const LOAD_VM_LOGS_SCROLL_RESPONSE = '[VM Logs] LOAD_VM_LOGS_SCROLL_RESPONSE';
export const SCROLL_VM_LOGS = '[VM Logs] SCROLL_VM_LOGS';
export const STOP_SCROLL_VM_LOGS = '[VM Logs] STOP_SCROLL_VM_LOGS';
export const SCROLL_VM_LOGS_REQUEST = '[VM Logs] SCROLL_VM_LOGS_REQUEST';
export const SCROLL_VM_LOGS_RESPONSE = '[VM Logs] SCROLL_VM_LOGS_RESPONSE';
export const SCROLL_VM_LOGS_ERROR = '[VM Logs] SCROLL_VM_LOGS_ERROR';
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

export class LoadVmLogsScrollRequest implements Action {
  type = LOAD_VM_LOGS_SCROLL_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadVmLogsResponse implements Action {
  type = LOAD_VM_LOGS_RESPONSE;

  constructor(public payload: Array<VmLog> | any) {
  }
}

export class LoadVmLogsScrollResponse implements Action {
  type = LOAD_VM_LOGS_SCROLL_RESPONSE;

  constructor(public payload: ScrollVmLogsList) {
  }
}

export class ScrollVmLogs implements Action {
  type = SCROLL_VM_LOGS;

  constructor(public payload?: any) {
  }
}

export class StopScrollVmLogs implements Action {
  type = STOP_SCROLL_VM_LOGS;

  constructor(public payload?: any) {
  }
}

export class ScrollVmLogsRequest implements Action {
  type = SCROLL_VM_LOGS_REQUEST;

  constructor(public payload?: any) {
  }
}

export class ScrollVmLogsResponse implements Action {
  type = SCROLL_VM_LOGS_RESPONSE;

  constructor(public payload: any) {
  }
}

export class ScrollVmLogsError implements Action {
  type = SCROLL_VM_LOGS_ERROR;

  constructor(public payload?: any) {
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
  | LoadVmLogsScrollRequest
  | ScrollVmLogs
  | StopScrollVmLogs
  | ScrollVmLogsRequest
  | ScrollVmLogsResponse
  | VmLogsFilterUpdate
  | VmLogsAddKeyword
  | VmLogsRemoveKeyword
  | VmLogsUpdateAccountIds;
