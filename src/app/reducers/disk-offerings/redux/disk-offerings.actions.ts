import { Action } from '@ngrx/store';

export const LOAD_DISK_OFFERINGS_REQUEST = '[OFFERINGS] LOAD_DISK_OFFERINGS_REQUEST';
export const LOAD_DISK_OFFERINGS_RESPONSE = '[OFFERINGS] LOAD_DISK_OFFERINGS_RESPONSE';
export const LOAD_DEFAULT_DISK_PARAMS_REQUEST = '[OFFERINGS] LOAD_DEFAULT_PARAMS_REQUEST';
export const LOAD_DEFAULT_DISK_PARAMS_RESPONSE = '[OFFERINGS] LOAD_DEFAULT_DISK_PARAMS_RESPONSE';

export class LoadOfferingsRequest implements Action {
  type = LOAD_DISK_OFFERINGS_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadOfferingsResponse implements Action {
  type = LOAD_DISK_OFFERINGS_RESPONSE;

  constructor(public payload: any) {}
}

export class LoadDefaultParamsResponse implements Action {
  type = LOAD_DEFAULT_DISK_PARAMS_RESPONSE;

  constructor(public payload: string[]) {}
}

export type Actions = LoadOfferingsResponse | LoadOfferingsRequest;
