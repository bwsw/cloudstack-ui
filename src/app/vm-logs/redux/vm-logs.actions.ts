import { Action } from '@ngrx/store';
import { VmLog } from '../models/vm-log.model';
import { Time } from '../../shared/components/time-picker/time-picker.component';
import { DateObject } from '../models/date-object.model';
import { VmLogFile } from '../models/vm-log-file.model';
import { VmLogsFilters } from '../models/vm-log-filters';
import { VmLogToken } from '../models/vm-log-token.model';
import { VirtualMachine } from '../../vm';

export enum VmLogsActionTypes {
  LOAD_VM_LOGS_REQUEST = '[VM Logs] LOAD_VM_LOGS_REQUEST',
  LOAD_VM_LOGS_RESPONSE = '[VM Logs] LOAD_VM_LOGS_RESPONSE',
  LOAD_AUTO_UPDATE_VM_LOGS_REQUEST = '[VM Logs] LOAD_AUTO_UPDATE_VM_LOGS_REQUEST',
  LOAD_AUTO_UPDATE_VM_LOGS_RESPONSE = '[VM Logs] LOAD_AUTO_UPDATE_VM_LOGS_RESPONSE',
  LOAD_AUTO_UPDATE_VM_LOGS_ERROR = '[VM Logs] LOAD_AUTO_UPDATE_VM_LOGS_ERROR',
  UPDATE_AUTO_UPDATE_VM_LOGS = '[VM Logs] UPDATE_AUTO_UPDATE_VM_LOGS',
  LOAD_VM_LOG_FILES_REQUEST = '[VM Logs] LOAD_VM_LOG_FILES_REQUEST',
  LOAD_VM_LOG_FILES_RESPONSE = '[VM Logs] LOAD_VM_LOG_FILES_RESPONSE',
  CREATE_TOKEN_REQUEST = '[VM Logs] CREATE_TOKEN_REQUEST',
  CREATE_TOKEN_RESPONSE = '[VM Logs] CREATE_TOKEN_RESPONSE',
  CREATE_TOKEN_ERROR = '[VM Logs] CREATE_TOKEN_ERROR',
  INVALIDATE_TOKEN_REQUEST = '[VM Logs] INVALIDATE_TOKEN_REQUEST',
  INVALIDATE_TOKEN_ERROR = '[VM Logs] INVALIDATE_TOKEN_ERROR',
  INVALIDATE_TOKEN_CANCELED = '[VM Logs] INVALIDATE_TOKEN_CANCELED',
  VM_LOGS_UPDATE_SEARCH = '[VM Logs] VM_LOGS_UPDATE_SEARCH',
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
  ENABLE_AUTO_UPDATE = '[VM Logs] ENABLE_AUTO_UPDATE',
  DISABLE_AUTO_UPDATE = '[VM Logs] DISABLE_AUTO_UPDATE',
  SET_AUTO_UPDATE_START_DATE = '[VM Logs] SET_AUTO_UPDATE_START_DATE',
  SET_AUTO_UPDATE_END_DATE = '[VM Logs] SET_AUTO_UPDATE_END_DATE',
  SCROLL_VM_LOGS = '[VM Logs] SCROLL_VM_LOGS',
  RESET_VM_LOGS_SCROLL = '[VM Logs] RESET_VM_LOGS_SCROLL',
  UPDATE_FILTERS = '[VM Logs] UPDATE_FILTERS',
  OPEN_CREATE_TOKEN = '[VM Logs] OPEN_CREATE_TOKEN',
  OPEN_INVALIDATE_TOKEN = '[VM Logs] OPEN_INVALIDATE_TOKEN',
}

export class LoadVmLogsRequest implements Action {
  readonly type = VmLogsActionTypes.LOAD_VM_LOGS_REQUEST;
}

export class LoadVmLogsResponse implements Action {
  readonly type = VmLogsActionTypes.LOAD_VM_LOGS_RESPONSE;

  constructor(readonly payload: VmLog[]) {}
}

export class LoadAutoUpdateVmLogsRequest implements Action {
  readonly type = VmLogsActionTypes.LOAD_AUTO_UPDATE_VM_LOGS_REQUEST;
}

export class LoadAutoUpdateVmLogsResponse implements Action {
  readonly type = VmLogsActionTypes.LOAD_AUTO_UPDATE_VM_LOGS_RESPONSE;

  constructor(readonly payload: VmLog[]) {}
}

export class LoadAutoUpdateVmLogsError implements Action {
  readonly type = VmLogsActionTypes.LOAD_AUTO_UPDATE_VM_LOGS_ERROR;

  constructor(readonly payload: Error) {}
}

export class UpdateAutoUpdateVmLogs implements Action {
  readonly type = VmLogsActionTypes.UPDATE_AUTO_UPDATE_VM_LOGS;

  constructor(readonly payload: VmLog[]) {}
}

export class LoadVmLogFilesRequest implements Action {
  readonly type = VmLogsActionTypes.LOAD_VM_LOG_FILES_REQUEST;
}

export class LoadVmLogFilesResponse implements Action {
  readonly type = VmLogsActionTypes.LOAD_VM_LOG_FILES_RESPONSE;

  constructor(readonly payload: VmLogFile[]) {}
}

export class CreateTokenRequest implements Action {
  readonly type = VmLogsActionTypes.CREATE_TOKEN_REQUEST;

  constructor(readonly payload: { vm: VirtualMachine }) {}
}

export class CreateTokenResponse implements Action {
  readonly type = VmLogsActionTypes.CREATE_TOKEN_RESPONSE;

  constructor(readonly payload: VmLogToken) {}
}

export class InvalidateTokenRequest implements Action {
  readonly type = VmLogsActionTypes.INVALIDATE_TOKEN_REQUEST;

  constructor(readonly payload: { token: string }) {}
}

export class InvalidateTokenError implements Action {
  readonly type = VmLogsActionTypes.INVALIDATE_TOKEN_ERROR;

  constructor(readonly payload: { token: string }) {}
}

export class InvalidateTokenCanceled implements Action {
  readonly type = VmLogsActionTypes.INVALIDATE_TOKEN_CANCELED;
}

export class CreateTokenError implements Action {
  readonly type = VmLogsActionTypes.CREATE_TOKEN_ERROR;

  constructor(readonly payload: Error) {}
}

export class VmLogsUpdateSearch implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_UPDATE_SEARCH;

  constructor(public payload: string) {}
}

export class VmLogsUpdateStartDateTime implements Action {
  readonly type = VmLogsActionTypes.VM_LOGS_UPDATE_START_DATE_TIME;

  constructor(readonly payload: DateObject) {}
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

  constructor(readonly payload: DateObject) {}
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

  constructor(readonly payload: string) {}
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

  constructor(readonly payload: string) {}
}

export class ScrollVmLogs implements Action {
  readonly type = VmLogsActionTypes.SCROLL_VM_LOGS;
}

export class ResetVmLogsScroll implements Action {
  readonly type = VmLogsActionTypes.RESET_VM_LOGS_SCROLL;
}

export class EnableAutoUpdate implements Action {
  readonly type = VmLogsActionTypes.ENABLE_AUTO_UPDATE;
}

export class DisableAutoUpdate implements Action {
  readonly type = VmLogsActionTypes.DISABLE_AUTO_UPDATE;
}

export class SetAutoUpdateStartDate implements Action {
  readonly type = VmLogsActionTypes.SET_AUTO_UPDATE_START_DATE;

  constructor(readonly payload: DateObject) {}
}

export class SetAutoUpdateEndDate implements Action {
  readonly type = VmLogsActionTypes.SET_AUTO_UPDATE_END_DATE;

  constructor(readonly payload: DateObject) {}
}

export class UpdateFilters implements Action {
  readonly type = VmLogsActionTypes.UPDATE_FILTERS;

  constructor(readonly payload: Partial<VmLogsFilters>) {}
}

export class OpenCreateToken implements Action {
  readonly type = VmLogsActionTypes.OPEN_CREATE_TOKEN;

  constructor(readonly payload: { vm: VirtualMachine }) {}
}

export class OpenInvalidateToken implements Action {
  readonly type = VmLogsActionTypes.OPEN_INVALIDATE_TOKEN;

  constructor(readonly payload: { vm: VirtualMachine }) {}
}

export type Actions =
  | LoadVmLogsResponse
  | LoadVmLogsRequest
  | LoadAutoUpdateVmLogsRequest
  | LoadAutoUpdateVmLogsResponse
  | LoadAutoUpdateVmLogsError
  | UpdateAutoUpdateVmLogs
  | LoadVmLogFilesRequest
  | LoadVmLogFilesResponse
  | CreateTokenRequest
  | CreateTokenResponse
  | CreateTokenError
  | InvalidateTokenRequest
  | InvalidateTokenError
  | InvalidateTokenCanceled
  | VmLogsUpdateSearch
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
  | VmLogsToggleNewestFirst
  | EnableAutoUpdate
  | DisableAutoUpdate
  | SetAutoUpdateStartDate
  | SetAutoUpdateEndDate
  | ScrollVmLogs
  | ResetVmLogsScroll
  | UpdateFilters
  | OpenCreateToken
  | OpenInvalidateToken;
