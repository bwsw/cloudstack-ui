import { Action } from '@ngrx/store';
import { ResourceQuota } from '../models/resource-quota.model';

export enum ResourceQuotasActionTypes {
  LOAD_RESOURCE_QUOTAS_REQUEST = '[Resource Quotas] LOAD_RESOURCE_QUOTAS_REQUEST',
  LOAD_RESOURCE_QUOTAS_RESPONSE = '[Resource Quotas] LOAD_RESOURCE_QUOTAS_RESPONSE',
  UPDATE_RESOURCE_LIMIT = '[Resource Quotas] UPDATE_RESOURCE_LIMIT',
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

export class UpdateResourceLimit implements Action {
  readonly type = ResourceQuotasActionTypes.UPDATE_RESOURCE_LIMIT;

  constructor(
    readonly payload: {
      minimum: number;
      maximum: number;
    },
  ) {}
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
  | UpdateResourceLimit
  | UpdateAdminForm
  | UpdateAdminFormField;
