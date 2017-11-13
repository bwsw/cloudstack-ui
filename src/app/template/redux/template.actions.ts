import { Action } from '@ngrx/store';
import { BaseTemplateModel } from '../shared/base-template.model';

export const LOAD_TEMPLATE_REQUEST = '[Templates] LOAD_TEMPLATE_REQUEST';
export const LOAD_TEMPLATE_RESPONSE = '[Templates] LOAD_TEMPLATE_RESPONSE';
export const TEMPLATE_FILTER_UPDATE = '[Templates] TEMPLATE_FILTER_UPDATE';
export const TEMPLATE_CREATE_SUCCESS = '[Templates] TEMPLATE_CREATE_SUCCESS';
export const TEMPLATE_REMOVE_SUCCESS = '[Templates] TEMPLATE_REMOVE_SUCCESS';
export const LOAD_SELECTED_TEMPLATE = '[Templates] LOAD_SELECTED_TEMPLATE';

export class LoadTemplatesRequest implements Action {
  readonly type = LOAD_TEMPLATE_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadTemplatesResponse implements Action {
  readonly type = LOAD_TEMPLATE_RESPONSE;

  constructor(public payload: BaseTemplateModel[]) {
  }
}

export class TemplatesFilterUpdate implements Action {
  readonly type = TEMPLATE_FILTER_UPDATE;

  constructor(public payload: any) {
  }
}

export class CreateTemplateSuccess implements Action {
  readonly type = TEMPLATE_CREATE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class RemoveTemplateSuccess implements Action {
  readonly type = TEMPLATE_REMOVE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadSelectedTemplate implements Action {
  readonly type = LOAD_SELECTED_TEMPLATE;

  constructor(public payload: any) {
  }
}

export type Actions =
  LoadTemplatesRequest
  | LoadTemplatesResponse
  | TemplatesFilterUpdate
  | CreateTemplateSuccess
  | RemoveTemplateSuccess
  | LoadSelectedTemplate;


