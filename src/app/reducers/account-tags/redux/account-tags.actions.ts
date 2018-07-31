import { Action } from '@ngrx/store';
import { ServiceOffering } from '../../../shared/models/service-offering.model';
import { Tag } from '../../../shared/models/tag.model';

export const LOAD_ACCOUNT_TAGS_REQUEST = '[ACCOUNT_TAGS] LOAD_ACCOUNT_TAGS_REQUEST';
export const LOAD_ACCOUNT_TAGS_RESPONSE = '[ACCOUNT_TAGS] LOAD_ACCOUNT_TAGS_RESPONSE';
export const UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS = '[ACCOUNT_TAGS] UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS';
export const UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS_SUCCESS =
  '[ACCOUNT_TAGS] UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS_SUCCESS';
export const UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS_ERROR = '[ACCOUNT_TAGS] UPDATE_CUSTOM_SERVICE_OFFERING_PARAMS_ERROR';


export class LoadAccountTagsRequest implements Action {
  type = LOAD_ACCOUNT_TAGS_REQUEST;
  constructor(public payload?: any) {
  }
}

export class LoadAccountTagsResponse implements Action {
  type = LOAD_ACCOUNT_TAGS_RESPONSE;
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

export type Actions = LoadAccountTagsRequest
  | LoadAccountTagsResponse
  | UpdateCustomServiceOfferingParams
  | UpdateCustomServiceOfferingParamsSuccess
  | UpdateCustomServiceOfferingParamsError;
