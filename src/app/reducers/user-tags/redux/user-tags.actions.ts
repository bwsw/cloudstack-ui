import { Action } from '@ngrx/store';
import { ServiceOffering } from '../../../shared/models/service-offering.model';
import { Tag } from '../../../shared/models/tag.model';

export const LOAD_USER_TAGS_REQUEST = '[USER_TAGS] LOAD_USER_TAGS_REQUEST';
export const LOAD_USER_TAGS_RESPONSE = '[USER_TAGS] LOAD_USER_TAGS_RESPONSE';
export const UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS = '[USER_TAGS] UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS';
export const UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS_SUCCESS = '[USER_TAGS] UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS_SUCCESS';
export const UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS_ERROR = '[USER_TAGS] UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS_ERROR';


export class LoadUserTagsRequest implements Action {
  type = LOAD_USER_TAGS_REQUEST;
  constructor(public payload?: any) {
  }
}

export class LoadUserTagsResponse implements Action {
  type = LOAD_USER_TAGS_RESPONSE;
  constructor(public payload:  Tag[] ) {
  }
}

export class UpdateCustomServiceOfferingParams implements Action {
  type = UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS;
  constructor(public payload:  ServiceOffering ) {
  }
}

export class UpdateCustomServiceOfferingParamsSuccess implements Action {
  type = UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS_SUCCESS;
  constructor(public payload:  ServiceOffering ) {
  }
}

export class UpdateCustomServiceOfferingParamsError implements Action {
  type = UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS_ERROR;
  constructor(public payload:  Error ) {
  }
}

export type Actions = LoadUserTagsRequest
  | LoadUserTagsResponse;
