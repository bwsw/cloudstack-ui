import { Action } from '@ngrx/store';

export const LOAD_SERVICE_OFFERINGS_REQUEST = '[OFFERINGS] LOAD_SERVICE_OFFERINGS_REQUEST';
export const LOAD_SERVICE_OFFERINGS_RESPONSE = '[OFFERINGS] LOAD_SERVICE_OFFERINGS_RESPONSE';

export class LoadOfferingsRequest implements Action {
  type = LOAD_SERVICE_OFFERINGS_REQUEST;

  constructor(public payload?: any) {
  }

}

export class LoadOfferingsResponse implements Action {
  type = LOAD_SERVICE_OFFERINGS_RESPONSE;

  constructor(public payload:  any ) {
  }

}

export type Actions = LoadOfferingsResponse | LoadOfferingsRequest;
