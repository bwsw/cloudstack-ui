import { Action } from '@ngrx/store';

export const LOAD_DISK_OFFERINGS_REQUEST = '[OFFERINGS] LOAD_DISK_OFFERINGS_REQUEST';
export const LOAD_DISK_OFFERINGS_RESPONSE = '[OFFERINGS] LOAD_DISK_OFFERINGS_RESPONSE';
export const LOAD_SELECTED_DISK_OFFERING = '[OFFERINGS] LOAD_SELECTED_DISK_OFFERING';

export class LoadOfferingsRequest implements Action {
  type = LOAD_DISK_OFFERINGS_REQUEST;

  constructor(public payload?: any) {
  }

}

export class LoadOfferingsResponse implements Action {
  type = LOAD_DISK_OFFERINGS_RESPONSE;

  constructor(public payload:  any ) {
  }

}

export class LoadSelectedOffering implements Action {
  type = LOAD_SELECTED_DISK_OFFERING;

  constructor(public payload: string) {
  }

}

export type Actions = LoadOfferingsResponse | LoadOfferingsRequest | LoadSelectedOffering;
