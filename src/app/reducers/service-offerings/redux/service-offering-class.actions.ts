import { Action } from '@ngrx/store';
import { ServiceOfferingClass } from '../../../shared/models/service-offering.model';

export const LOAD_SERVICE_OFFERING_CLASS_REQUEST = '[OFFERING_GROUPS] LOAD_SERVICE_OFFERING_CLASS_REQUEST';
export const LOAD_SERVICE_OFFERING_CLASS_RESPONSE = '[OFFERING_GROUPS] LOAD_SERVICE_OFFERING_CLASS_RESPONSE';


export class LoadServiceOfferingClassRequest implements Action {
  type = LOAD_SERVICE_OFFERING_CLASS_REQUEST;
  constructor(public payload?: any) {
  }
}

export class LoadServiceOfferingClassResponse implements Action {
  type = LOAD_SERVICE_OFFERING_CLASS_RESPONSE;
  constructor(public payload:  ServiceOfferingClass[] ) {
  }
}

export type Actions = LoadServiceOfferingClassRequest
  | LoadServiceOfferingClassResponse;
