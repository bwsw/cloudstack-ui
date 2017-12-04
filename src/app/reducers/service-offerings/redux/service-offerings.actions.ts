import { Action } from '@ngrx/store';

export const LOAD_SERVICE_OFFERINGS_REQUEST = '[OFFERINGS] LOAD_SERVICE_OFFERINGS_REQUEST';
export const LOAD_SERVICE_OFFERINGS_RESPONSE = '[OFFERINGS] LOAD_SERVICE_OFFERINGS_RESPONSE';
export const LOAD_OFFERING_AVAILABILITY_REQUEST = '[OFFERINGS] LOAD_OFFERING_AVAILABILITY_REQUEST';
export const LOAD_OFFERING_AVAILABILITY_RESPONSE = '[OFFERINGS] LOAD_OFFERING_AVAILABILITY_RESPONSE';
export const LOAD_DEFAULT_PARAMS_REQUEST = '[OFFERINGS] LOAD_DEFAULT_PARAMS_REQUEST';
export const LOAD_DEFAULT_PARAMS_RESPONSE = '[OFFERINGS] LOAD_DEFAULT_PARAMS_RESPONSE';
export const LOAD_CUSTOM_RESTRICTION_REQUEST = '[OFFERINGS] LOAD_CUSTOM_RESTRICTION_REQUEST';
export const LOAD_CUSTOM_RESTRICTION_RESPONSE = '[OFFERINGS] LOAD_CUSTOM_RESTRICTION_RESPONSE';

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
export class LoadOfferingAvailabilityRequest implements Action {
  type = LOAD_OFFERING_AVAILABILITY_REQUEST;
  constructor(public payload?: any) {
  }
}

export class LoadOfferingAvailabilityResponse implements Action {
  type = LOAD_OFFERING_AVAILABILITY_RESPONSE;
  constructor(public payload:  any ) {
  }
}
export class LoadDefaultParamsRequest implements Action {
  type = LOAD_DEFAULT_PARAMS_REQUEST;
  constructor(public payload?: any) {
  }
}

export class LoadDefaultParamsResponse implements Action {
  type = LOAD_DEFAULT_PARAMS_RESPONSE;
  constructor(public payload:  any ) {
  }
}
export class LoadCustomRestrictionsRequest implements Action {
  type = LOAD_CUSTOM_RESTRICTION_REQUEST;
  constructor(public payload?: any) {
  }
}

export class LoadCustomRestrictionsResponse implements Action {
  type = LOAD_CUSTOM_RESTRICTION_RESPONSE;
  constructor(public payload:  any ) {
  }
}

export type Actions = LoadOfferingsResponse
  | LoadOfferingsRequest
  | LoadCustomRestrictionsRequest
  | LoadCustomRestrictionsResponse
  | LoadDefaultParamsRequest
  | LoadDefaultParamsResponse
  | LoadOfferingAvailabilityRequest
  | LoadOfferingAvailabilityResponse;
