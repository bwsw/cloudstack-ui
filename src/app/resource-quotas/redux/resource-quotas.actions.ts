import { Action } from '@ngrx/store';
import { ResourceQuota } from '../models/resource-quota.model';

export enum ResourceQuotasActionTypes {
  LOAD_RESOURCE_QUOTAS_REQUEST = '[Resource Quotas] LOAD_RESOURCE_QUOTAS_REQUEST',
  LOAD_RESOURCE_QUOTAS_RESPONSE = '[Resource Quotas] LOAD_RESOURCE_QUOTAS_RESPONSE',
  LOAD_RESOURCE_QUOTAS_ERROR = '[Resource Quotas] LOAD_RESOURCE_QUOTAS_ERROR',
  UPDATE_RESOURCE_LIMITS_REQUEST = '[Resource Quotas] UPDATE_RESOURCE_LIMITS_REQUEST',
  UPDATE_RESOURCE_LIMITS_RESPONSE = '[Resource Quotas] UPDATE_RESOURCE_LIMITS_RESPONSE',
  UPDATE_RESOURCE_LIMITS_ERROR = '[Resource Quotas] UPDATE_RESOURCE_LIMITS_ERROR',
  UPDATE_ADMIN_FORM = '[Resource Quotas] UPDATE_ADMIN_FORM',
  UPDATE_ADMIN_FORM_FIELD = '[Resource Quotas] UPDATE_ADMIN_FORM_FIELD',
}

export class LoadResourceQuotasRequest implements Action {
  readonly type = ResourceQuotasActionTypes.LOAD_RESOURCE_QUOTAS_REQUEST;
}

export class LoadResourceQuotasResponse implements Action {
  readonly type = ResourceQuotasActionTypes.LOAD_RESOURCE_QUOTAS_RESPONSE;

  constructor(readonly payload: ResourceQuota[]) {}
}

export class LoadResourceQuotasError implements Action {
  readonly type = ResourceQuotasActionTypes.LOAD_RESOURCE_QUOTAS_ERROR;

  constructor(readonly payload: Error) {}
}

export class UpdateResourceLimitsRequest implements Action {
  readonly type = ResourceQuotasActionTypes.UPDATE_RESOURCE_LIMITS_REQUEST;
}

export class UpdateResourceLimitsResponse implements Action {
  readonly type = ResourceQuotasActionTypes.UPDATE_RESOURCE_LIMITS_RESPONSE;
}

export class UpdateResourceLimitsError implements Action {
  readonly type = ResourceQuotasActionTypes.UPDATE_RESOURCE_LIMITS_ERROR;

  constructor(readonly payload: Error) {}
}

export class UpdateAdminForm implements Action {
  readonly type = ResourceQuotasActionTypes.UPDATE_ADMIN_FORM;

  constructor(
    readonly payload: {
      [resourceType: number]: {
        minimum: number;
        maximum: number;
      };
    },
  ) {}
}

export class UpdateAdminFormField implements Action {
  readonly type = ResourceQuotasActionTypes.UPDATE_ADMIN_FORM_FIELD;

  constructor(
    readonly payload: {
      resourceType: number;
      minimum?: number;
      maximum?: number;
    },
  ) {}
}

export type Actions =
  | LoadResourceQuotasRequest
  | LoadResourceQuotasResponse
  | LoadResourceQuotasError
  | UpdateResourceLimitsRequest
  | UpdateResourceLimitsResponse
  | UpdateResourceLimitsError
  | UpdateAdminForm
  | UpdateAdminFormField;
