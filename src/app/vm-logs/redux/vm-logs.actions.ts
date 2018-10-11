import { Action } from '@ngrx/store';
import { VmLog } from '../models/vm-log.model';

export const LOAD_VM_LOGS_REQUEST = '[VM Logs] LOAD_VM_LOGS_REQUEST';
export const LOAD_VM_LOGS_RESPONSE = '[VM Logs] LOAD_VM_LOGS_RESPONSE';
export const VM_LOGS_FILTER_UPDATE = '[VM Logs] VM_LOGS_FILTER_UPDATE';

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

  constructor(public payload: {
    selectedVmId: string
  } | any) {
  }

}


export type Actions = LoadVmLogsResponse | LoadVmLogsRequest | VmLogsFilterUpdate;
