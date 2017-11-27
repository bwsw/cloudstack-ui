import { Action } from '@ngrx/store';

export const LOAD_VM_REQUEST = '[VM] LOAD_VM_REQUEST';
export const LOAD_VM_RESPONSE = '[VM] LOAD_VM_RESPONSE';

export class LoadVMRequest implements Action {
  type = LOAD_VM_REQUEST;

  constructor(public payload?: any) {
  }

}

export class LoadVMResponse implements Action {
  type = LOAD_VM_RESPONSE;

  constructor(public payload: any ) {
  }

}

export type Actions = LoadVMRequest
  | LoadVMResponse;
