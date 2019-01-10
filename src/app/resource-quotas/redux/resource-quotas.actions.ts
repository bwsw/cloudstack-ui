import { Action } from '@ngrx/store';
import { ResourceQuota } from '../models/resource-quota.model';
import { resourceType } from '../../template/shared';
import { ResourceLimit } from '../../shared/models';

export enum ResourceQuotasActionTypes {
  LOAD_RESOURCE_QUOTAS_REQUEST = '[Resource Quotas] LOAD_RESOURCE_QUOTAS_REQUEST',
  LOAD_RESOURCE_QUOTAS_RESPONSE = '[Resource Quotas] LOAD_RESOURCE_QUOTAS_RESPONSE',
  LOAD_RESOURCE_QUOTAS_ERROR = '[Resource Quotas] LOAD_RESOURCE_QUOTAS_ERROR',
  UPDATE_RESOURCE_QUOTAS_REQUEST = '[Resource Quotas] UPDATE_RESOURCE_QUOTAS_REQUEST',
  UPDATE_RESOURCE_QUOTAS_RESPONSE = '[Resource Quotas] UPDATE_RESOURCE_QUOTAS_RESPONSE',
  UPDATE_RESOURCE_QUOTAS_ERROR = '[Resource Quotas] UPDATE_RESOURCE_QUOTAS_ERROR',
  UPDATE_RESOURCE_LIMITS_REQUEST = '[Resource Quotas] UPDATE_RESOURCE_LIMITS_REQUEST',
  UPDATE_RESOURCE_LIMITS_RESPONSE = '[Resource Quotas] UPDATE_RESOURCE_LIMITS_RESPONSE',
  UPDATE_RESOURCE_LIMITS_ERROR = '[Resource Quotas] UPDATE_RESOURCE_LIMITS_ERROR',
  UPDATE_ADMIN_FORM = '[Resource Quotas] UPDATE_ADMIN_FORM',
  UPDATE_ADMIN_FORM_FIELD = '[Resource Quotas] UPDATE_ADMIN_FORM_FIELD',
  UPDATE_USER_FORM_QUOTAS = '[Resource Quotas] UPDATE_USER_FORM_QUOTAS',
  UPDATE_USER_FORM_LIMITS = '[Resource Quotas] UPDATE_USER_FORM_LIMITS',
  UPDATE_USER_FORM_FIELD = '[Resource Quotas] UPDATE_USER_FORM_FIELD',
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

export class UpdateResourceQuotasRequest implements Action {
  readonly type = ResourceQuotasActionTypes.UPDATE_RESOURCE_QUOTAS_REQUEST;
}

export class UpdateResourceQuotasResponse implements Action {
  readonly type = ResourceQuotasActionTypes.UPDATE_RESOURCE_QUOTAS_RESPONSE;
}

export class UpdateResourceQuotasError implements Action {
  readonly type = ResourceQuotasActionTypes.UPDATE_RESOURCE_QUOTAS_ERROR;

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

export class UpdateUserFormQuotas implements Action {
  readonly type = ResourceQuotasActionTypes.UPDATE_USER_FORM_QUOTAS;

  constructor(
    readonly payload: {
      [resourceType: number]: {
        minimum: number;
        maximum: number;
      };
    },
  ) {}
}

export class UpdateUserFormLimits implements Action {
  readonly type = ResourceQuotasActionTypes.UPDATE_USER_FORM_LIMITS;

  constructor(
    readonly payload: {
      [resourceType: number]: ResourceLimit;
    },
  ) {}
}

export class UpdateUserFormField implements Action {
  readonly type = ResourceQuotasActionTypes.UPDATE_USER_FORM_FIELD;

  constructor(
    readonly payload: {
      resourceType: number;
      limit?: number;
    },
  ) {}
}

export type Actions =
  | LoadResourceQuotasRequest
  | LoadResourceQuotasResponse
  | LoadResourceQuotasError
  | UpdateResourceQuotasRequest
  | UpdateResourceQuotasResponse
  | UpdateResourceQuotasError
  | UpdateResourceLimitsRequest
  | UpdateResourceLimitsResponse
  | UpdateResourceLimitsError
  | UpdateAdminForm
  | UpdateAdminFormField
  | UpdateUserFormQuotas
  | UpdateUserFormLimits
  | UpdateUserFormField;
