import { Action } from '@ngrx/store';
import { VirtualMachine } from '../../../vm/shared/vm.model';

export const LOAD_VM_REQUEST = '[VM] LOAD_VM_REQUEST';
export const LOAD_VMS_REQUEST = '[VM] LOAD_VMS_REQUEST';
export const LOAD_VMS_RESPONSE = '[VM] LOAD_VMS_RESPONSE';
export const VM_FILTER_UPDATE = '[VM] VM_FILTER_UPDATE';
export const LOAD_SELECTED_VM = '[VM] LOAD_SELECTED_VM';
export const VM_CHANGE_DESCRIPTION = '[VM] VM_CHANGE_DESCRIPTION';
export const UPDATE_VM = '[VM] UPDATE_VM';
export const ATTACH_ISO = '[VM] ATTACH_ISO';
export const DETACH_ISO = '[VM] DETACH_ISO';
export const STOP_VM = '[VM] STOP_VM';
export const VM_UPDATE_ERROR = '[VM] VM_UPDATE_ERROR';

export class LoadVMsRequest implements Action {
  type = LOAD_VMS_REQUEST;

  constructor(public payload?: any) {
  }

}

export class LoadVMRequest implements Action {
  type = LOAD_VM_REQUEST;

  constructor(public payload: any) {
  }

}

export class LoadVMsResponse implements Action {
  type = LOAD_VMS_RESPONSE;

  constructor(public payload: any ) {
  }

}

export class VMFilterUpdate implements Action {
  type = VM_FILTER_UPDATE;

  constructor(public payload: { [key: string]: any }) {
  }

}

export class LoadSelectedVM implements Action {
  type = LOAD_SELECTED_VM;

  constructor(public payload: string) {
  }

}

export class ChangeDescription implements Action {
  type = VM_CHANGE_DESCRIPTION;

  constructor(public payload: any) {
  }

}

export class UpdateVM implements Action {
  readonly type = UPDATE_VM;

  constructor(public payload: VirtualMachine) {
  }
}

export class AttachIso implements Action {
  readonly type = ATTACH_ISO;

  constructor(public payload: any) {
  }
}

export class DetachIso implements Action {
  readonly type = DETACH_ISO;

  constructor(public payload: any) {
  }
}

export class StopVM implements Action {
  readonly type = STOP_VM;

  constructor(public payload: VirtualMachine) {
  }
}

export class VMUpdateError implements Action {
  readonly type = VM_UPDATE_ERROR;

  constructor(public payload: any) {
  }
}

export type Actions = LoadVMsRequest
  | LoadVMsResponse
  | LoadVMRequest
  | VMFilterUpdate
  | LoadSelectedVM
  | ChangeDescription
  | UpdateVM
  | AttachIso
  | DetachIso
  | StopVM
  | VMUpdateError;
