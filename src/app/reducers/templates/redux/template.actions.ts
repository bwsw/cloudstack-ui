import { Action } from '@ngrx/store';
import { BaseTemplateModel } from '../../../template/shared/base-template.model';
import { ImageGroup } from '../../../shared/models/config/image-group.model';

export const LOAD_TEMPLATE_REQUEST = '[Templates] LOAD_TEMPLATE_REQUEST';
export const LOAD_TEMPLATE_RESPONSE = '[Templates] LOAD_TEMPLATE_RESPONSE';
export const LOAD_SELECTED_TEMPLATE = '[Templates] LOAD_SELECTED_TEMPLATE';
export const TEMPLATE_FILTER_UPDATE = '[Templates] TEMPLATE_FILTER_UPDATE';
export const TEMPLATE_REGISTER = '[Templates] TEMPLATE_REGISTER';
export const TEMPLATE_REGISTER_SUCCESS = '[Templates] TEMPLATE_REGISTER_SUCCESS';
export const TEMPLATE_REGISTER_ERROR = '[Templates] TEMPLATE_REGISTER_ERROR';
export const TEMPLATE_CREATE = '[Templates] TEMPLATE_CREATE';
export const TEMPLATE_CREATE_SUCCESS = '[Templates] TEMPLATE_CREATE_SUCCESS';
export const TEMPLATE_CREATE_ERROR = '[Templates] TEMPLATE_CREATE_ERROR';
export const TEMPLATE_REMOVE = '[Templates] TEMPLATE_REMOVE';
export const TEMPLATE_REMOVE_SUCCESS = '[Templates] TEMPLATE_REMOVE_SUCCESS';
export const TEMPLATE_REMOVE_ERROR = '[Templates] TEMPLATE_REMOVE_ERROR';
export const DIALOG_TEMPLATE_FILTER_UPDATE = '[Templates] DIALOG_TEMPLATE_FILTER_UPDATE';
export const UPDATE_TEMPLATE = '[Templates] UPDATE_TEMPLATE';
export const SET_TEMPLATE_GROUP = '[Templates] SET_TEMPLATE_GROUP';
export const SET_TEMPLATE_GROUP_SUCCESS = '[Templates] SET_TEMPLATE_GROUP_SUCCESS';
export const SET_TEMPLATE_GROUP_ERROR = '[Templates] SET_TEMPLATE_GROUP_ERROR';
export const RESET_TEMPLATE_GROUP = '[Templates] RESET_TEMPLATE_GROUP';
export const RESET_TEMPLATE_GROUP_SUCCESS = '[Templates] RESET_TEMPLATE_GROUP_SUCCESS';

export class LoadTemplatesRequest implements Action {
  readonly type = LOAD_TEMPLATE_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadTemplatesResponse implements Action {
  readonly type = LOAD_TEMPLATE_RESPONSE;

  constructor(public payload: BaseTemplateModel[]) {}
}

export class LoadSelectedTemplate implements Action {
  readonly type = LOAD_SELECTED_TEMPLATE;

  constructor(public payload: string) {}
}

export class TemplatesFilterUpdate implements Action {
  readonly type = TEMPLATE_FILTER_UPDATE;

  constructor(public payload: any) {}
}

export class DialogTemplatesFilterUpdate implements Action {
  readonly type = DIALOG_TEMPLATE_FILTER_UPDATE;

  constructor(public payload: any) {}
}

export class RegisterTemplate implements Action {
  readonly type = TEMPLATE_REGISTER;

  constructor(public payload: any) {}
}

export class RegisterTemplateSuccess implements Action {
  readonly type = TEMPLATE_REGISTER_SUCCESS;

  constructor(public payload: any) {}
}

export class RegisterTemplateError implements Action {
  readonly type = TEMPLATE_REGISTER_ERROR;

  constructor(public payload: Error) {}
}

export class CreateTemplate implements Action {
  readonly type = TEMPLATE_CREATE;

  constructor(public payload: any) {}
}

export class CreateTemplateSuccess implements Action {
  readonly type = TEMPLATE_CREATE_SUCCESS;

  constructor(public payload: any) {}
}

export class CreateTemplateError implements Action {
  readonly type = TEMPLATE_CREATE_ERROR;

  constructor(public payload: Error) {}
}

export class RemoveTemplate implements Action {
  readonly type = TEMPLATE_REMOVE;

  constructor(public payload: BaseTemplateModel) {}
}

export class RemoveTemplateSuccess implements Action {
  readonly type = TEMPLATE_REMOVE_SUCCESS;

  constructor(public payload: BaseTemplateModel) {}
}

export class RemoveTemplateError implements Action {
  readonly type = TEMPLATE_REMOVE_ERROR;

  constructor(public payload?: any) {}
}

export class UpdateTemplate implements Action {
  readonly type = UPDATE_TEMPLATE;

  constructor(public payload: any) {}
}

export class SetTemplateGroup implements Action {
  readonly type = SET_TEMPLATE_GROUP;

  constructor(public payload: { template: BaseTemplateModel; templateGroup: ImageGroup }) {}
}

export class SetTemplateGroupSuccess implements Action {
  readonly type = SET_TEMPLATE_GROUP_SUCCESS;

  constructor(public payload: BaseTemplateModel) {}
}

export class SetTemplateGroupError implements Action {
  readonly type = SET_TEMPLATE_GROUP_ERROR;

  constructor(public payload: any) {}
}

export class ResetTemplateGroup implements Action {
  readonly type = RESET_TEMPLATE_GROUP;

  constructor(public payload: BaseTemplateModel) {}
}

export class ResetTemplateGroupSuccess implements Action {
  readonly type = RESET_TEMPLATE_GROUP_SUCCESS;

  constructor(public payload: BaseTemplateModel) {}
}

export type Actions =
  | LoadTemplatesRequest
  | LoadTemplatesResponse
  | LoadSelectedTemplate
  | TemplatesFilterUpdate
  | DialogTemplatesFilterUpdate
  | RemoveTemplate
  | RemoveTemplateError
  | RemoveTemplateSuccess
  | RegisterTemplate
  | RegisterTemplateSuccess
  | RegisterTemplateError
  | CreateTemplate
  | CreateTemplateSuccess
  | CreateTemplateError
  | UpdateTemplate
  | SetTemplateGroup
  | SetTemplateGroupSuccess
  | SetTemplateGroupError
  | ResetTemplateGroup
  | ResetTemplateGroupSuccess;
