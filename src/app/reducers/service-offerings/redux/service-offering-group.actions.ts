import { Action } from '@ngrx/store';

export const LOAD_SERVICE_OFFERING_GROUP_REQUEST = '[OFFERING_GROUPS] LOAD_SERVICE_OFFERING_GROUP_REQUEST';
export const LOAD_SERVICE_OFFERING_GROUP_RESPONSE = '[OFFERING_GROUPS] LOAD_SERVICE_OFFERING_GROUP_RESPONSE';


export class LoadServiceOfferingGroupRequest implements Action {
  type = LOAD_SERVICE_OFFERING_GROUP_REQUEST;
  constructor(public payload?: any) {
  }
}

export class LoadServiceOfferingGroupResponse implements Action {
  type = LOAD_SERVICE_OFFERING_GROUP_RESPONSE;
  constructor(public payload:  any ) {
  }
}

export type Actions = LoadServiceOfferingGroupRequest
  | LoadServiceOfferingGroupResponse;
