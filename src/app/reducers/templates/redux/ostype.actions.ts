import { Action } from '@ngrx/store';
import { OsType } from '../../../shared/models/os-type.model';

export const LOAD_OS_TYPES_REQUEST = '[OS_TYPES] LOAD_OS_TYPES_REQUEST';
export const LOAD_OS_TYPES_RESPONSE = '[OS_TYPES] LOAD_OS_TYPES_RESPONSE';

export class LoadOsTypesRequest implements Action {
  type = LOAD_OS_TYPES_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadOsTypesResponse implements Action {
  type = LOAD_OS_TYPES_RESPONSE;

  constructor(public payload: OsType[]) {}
}

export type Actions = LoadOsTypesRequest | LoadOsTypesResponse;
