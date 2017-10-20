import { Action } from '@ngrx/store';

export const LOAD_OS_TYPES_REQUEST = '[DOMAINS] LOAD_OS_TYPES_REQUEST';
export const LOAD_OS_TYPES_RESPONSE = '[DOMAINS] LOAD_OS_TYPES_RESPONSE';

export class LoadOsTypesRequest implements Action {
  type = LOAD_OS_TYPES_REQUEST;

  constructor(public payload?: any) {
  }

}

export class LoadOsTypesResponse implements Action {
  type = LOAD_OS_TYPES_RESPONSE;

  constructor(public payload: any) {
  }
}

export type Actions = LoadOsTypesRequest | LoadOsTypesResponse;
