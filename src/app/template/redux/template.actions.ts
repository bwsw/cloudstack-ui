import { Action } from '@ngrx/store';

export const LOAD_TEMPLATE_REQUEST = '[Templates] LOAD_TEMPLATE_REQUEST';
export const LOAD_TEMPLATE_RESPONSE = '[Templates] LOAD_TEMPLATE_RESPONSE';
export const TEMPLATE_FILTER_UPDATE = '[Templates] TEMPLATE_FILTER_UPDATE';

export class LoadTemplatesRequest implements Action {
  readonly type = LOAD_TEMPLATE_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadTemplatesResponse implements Action {
  readonly type = LOAD_TEMPLATE_RESPONSE;

  constructor(public payload: any) {
  }
}

export class TemplatesFilterUpdate implements Action {
  readonly type = TEMPLATE_FILTER_UPDATE;

  constructor(public payload: any) {
  }
}

export type Actions =
  LoadTemplatesRequest
  | LoadTemplatesResponse
  | TemplatesFilterUpdate;


