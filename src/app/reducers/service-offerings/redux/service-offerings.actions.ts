import { Action } from '@ngrx/store';
import {
  ServiceOffering,
  ServiceOfferingGroup
} from '../../../shared/models/service-offering.model';

export const LOAD_SERVICE_OFFERINGS_REQUEST = '[OFFERINGS] LOAD_SERVICE_OFFERINGS_REQUEST';
export const LOAD_SERVICE_OFFERINGS_RESPONSE = '[OFFERINGS] LOAD_SERVICE_OFFERINGS_RESPONSE';
export const LOAD_OFFERING_AVAILABILITY_REQUEST = '[OFFERINGS] LOAD_OFFERING_AVAILABILITY_REQUEST';
export const LOAD_OFFERING_AVAILABILITY_RESPONSE = '[OFFERINGS] LOAD_OFFERING_AVAILABILITY_RESPONSE';
export const LOAD_DEFAULT_PARAMS_REQUEST = '[OFFERINGS] LOAD_DEFAULT_PARAMS_REQUEST';
export const LOAD_DEFAULT_PARAMS_RESPONSE = '[OFFERINGS] LOAD_DEFAULT_PARAMS_RESPONSE';
export const LOAD_CUSTOM_RESTRICTION_REQUEST = '[OFFERINGS] LOAD_CUSTOM_RESTRICTION_REQUEST';
export const LOAD_CUSTOM_RESTRICTION_RESPONSE = '[OFFERINGS] LOAD_CUSTOM_RESTRICTION_RESPONSE';
export const SET_SERVICE_OFFERING_GROUP = '[OFFERINGS] SET_SERVICE_OFFERING_GROUP';
export const RESET_SERVICE_OFFERING_GROUP = '[OFFERINGS] RESET_SERVICE_OFFERING_GROUP';
export const RESET_SERVICE_OFFERING_GROUP_SUCCESS = '[OFFERINGS] RESET_SERVICE_OFFERING_GROUP_SUCCESS';
export const SET_SERVICE_OFFERING_GROUP_SUCCESS = '[OFFERINGS] SET_SERVICE_OFFERING_GROUP_SUCCESS';
export const SET_SERVICE_OFFERING_GROUP_ERROR = '[OFFERINGS] SET_SERVICE_OFFERING_GROUP_ERROR';

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

export class SetServiceOfferingGroup implements Action {
  readonly type = SET_SERVICE_OFFERING_GROUP;

  constructor(public payload: {
    serviceOffering: ServiceOffering,
    serviceOfferingGroup: ServiceOfferingGroup
  }) {
  }
}

export class SetServiceOfferingGroupSuccess implements Action {
  readonly type = SET_SERVICE_OFFERING_GROUP_SUCCESS;

  constructor(public payload: ServiceOffering) {
  }
}
export class SetServiceOfferingGroupError implements Action {
  readonly type = SET_SERVICE_OFFERING_GROUP_ERROR;

  constructor(public payload: any) {
  }
}

export class ResetServiceOfferingGroup implements Action {
  readonly type = RESET_SERVICE_OFFERING_GROUP;

  constructor(public payload: ServiceOffering) {
  }
}

export class ResetServiceOfferingGroupSuccess implements Action {
  readonly type = RESET_SERVICE_OFFERING_GROUP_SUCCESS;

  constructor(public payload: ServiceOffering) {
  }
}

export type Actions = LoadOfferingsResponse
  | LoadOfferingsRequest
  | LoadCustomRestrictionsRequest
  | LoadCustomRestrictionsResponse
  | LoadDefaultParamsRequest
  | LoadDefaultParamsResponse
  | LoadOfferingAvailabilityRequest
  | LoadOfferingAvailabilityResponse
  | ResetServiceOfferingGroupSuccess
  | ResetServiceOfferingGroup
  | SetServiceOfferingGroupError
  | SetServiceOfferingGroupSuccess
  | SetServiceOfferingGroup;
