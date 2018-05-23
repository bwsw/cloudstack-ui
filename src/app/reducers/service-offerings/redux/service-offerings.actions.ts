import { Action } from '@ngrx/store';
import { ICustomOfferingRestrictionsByZone, ServiceOffering } from '../../../shared/models';
import { ICustomServiceOffering } from '../../../service-offering/custom-service-offering/custom-service-offering';
import { OfferingAvailability, OfferingCompatibilityPolicy } from '../../../shared/services/offering.service';

export const LOAD_SERVICE_OFFERINGS_REQUEST = '[OFFERINGS] LOAD_SERVICE_OFFERINGS_REQUEST';
export const LOAD_SERVICE_OFFERINGS_RESPONSE = '[OFFERINGS] LOAD_SERVICE_OFFERINGS_RESPONSE';
export const SERVICE_OFFERINGS_FILTER_UPDATE = '[OFFERINGS] SERVICE_OFFERINGS_FILTER_UPDATE';
export const UPDATE_CUSTOM_SERVICE_OFFERING = '[OFFERINGS] UPDATE_CUSTOM_SERVICE_OFFERING';
export const LOAD_OFFERING_AVAILABILITY_REQUEST = '[OFFERINGS] LOAD_OFFERING_AVAILABILITY_REQUEST';
export const LOAD_OFFERING_AVAILABILITY_RESPONSE = '[OFFERINGS] LOAD_OFFERING_AVAILABILITY_RESPONSE';
export const LOAD_DEFAULT_PARAMS_REQUEST = '[OFFERINGS] LOAD_DEFAULT_PARAMS_REQUEST';
export const LOAD_DEFAULT_PARAMS_RESPONSE = '[OFFERINGS] LOAD_DEFAULT_PARAMS_RESPONSE';
export const LOAD_CUSTOM_RESTRICTION_REQUEST = '[OFFERINGS] LOAD_CUSTOM_RESTRICTION_REQUEST';
export const LOAD_CUSTOM_RESTRICTION_RESPONSE = '[OFFERINGS] LOAD_CUSTOM_RESTRICTION_RESPONSE';
export const LOAD_COMPATIBILITY_POLICY_REQUEST = '[OFFERINGS] LOAD_COMPABILITY_POLICY_REQUEST';
export const LOAD_COMPATIBILITY_POLICY_RESPONSE = '[OFFERINGS] LOAD_COMPABILITY_POLICY_RESPONSE';


export class LoadOfferingsRequest implements Action {
  type = LOAD_SERVICE_OFFERINGS_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadOfferingsResponse implements Action {
  type = LOAD_SERVICE_OFFERINGS_RESPONSE;

  constructor(public payload: ServiceOffering[]) {
  }
}

export class UpdateCustomServiceOffering implements Action {
  type = UPDATE_CUSTOM_SERVICE_OFFERING;

  constructor(public payload: ServiceOffering) {
  }
}

export class ServiceOfferingsFilterUpdate implements Action {
  type = SERVICE_OFFERINGS_FILTER_UPDATE;

  constructor(public payload: any) {
  }
}

export class LoadOfferingAvailabilityRequest implements Action {
  type = LOAD_OFFERING_AVAILABILITY_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadOfferingAvailabilityResponse implements Action {
  type = LOAD_OFFERING_AVAILABILITY_RESPONSE;

  constructor(public payload: OfferingAvailability) {
  }
}

export class LoadDefaultParamsRequest implements Action {
  type = LOAD_DEFAULT_PARAMS_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadDefaultParamsResponse implements Action {
  type = LOAD_DEFAULT_PARAMS_RESPONSE;

  constructor(public payload: ICustomServiceOffering) {
  }
}

export class LoadCustomRestrictionsRequest implements Action {
  type = LOAD_CUSTOM_RESTRICTION_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadCustomRestrictionsResponse implements Action {
  type = LOAD_CUSTOM_RESTRICTION_RESPONSE;

  constructor(public payload: ICustomOfferingRestrictionsByZone) {
  }
}

export class LoadCompatibilityPolicyRequest implements Action {
  type = LOAD_COMPATIBILITY_POLICY_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadCompatibilityPolicyResponse implements Action {
  type = LOAD_COMPATIBILITY_POLICY_RESPONSE;

  constructor(public payload: OfferingCompatibilityPolicy) {
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
  | LoadCompatibilityPolicyResponse
  | LoadCompatibilityPolicyRequest;
