import { Action } from '@ngrx/store';
import { ServiceOffering } from '../../../shared/models';

export const LOAD_SERVICE_OFFERINGS_REQUEST = '[OFFERINGS] LOAD_SERVICE_OFFERINGS_REQUEST';
export const LOAD_SERVICE_OFFERINGS_RESPONSE = '[OFFERINGS] LOAD_SERVICE_OFFERINGS_RESPONSE';
export const SERVICE_OFFERINGS_FILTER_UPDATE = '[OFFERINGS] SERVICE_OFFERINGS_FILTER_UPDATE';

export class LoadOfferingsRequest implements Action {
  type = LOAD_SERVICE_OFFERINGS_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadOfferingsResponse implements Action {
  type = LOAD_SERVICE_OFFERINGS_RESPONSE;

  constructor(public payload: ServiceOffering[]) {}
}

export class ServiceOfferingsFilterUpdate implements Action {
  type = SERVICE_OFFERINGS_FILTER_UPDATE;

  constructor(public payload: any) {}
}

export type Actions = LoadOfferingsResponse | LoadOfferingsRequest;
