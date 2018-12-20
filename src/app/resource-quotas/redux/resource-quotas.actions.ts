import { Action } from '@ngrx/store';
import { ResourceQuota } from '../models/resource-quota.model';

export enum ResourceQuotasActionTypes {
  LOAD_RESOURCE_QUOTAS_REQUEST = '[Resource Quotas] LOAD_RESOURCE_QUOTAS_REQUEST',
  LOAD_RESOURCE_QUOTAS_RESPONSE = '[Resource Quotas] LOAD_RESOURCE_QUOTAS_RESPONSE',
}

export class LoadResourceQuotasRequest implements Action {
  readonly type = ResourceQuotasActionTypes.LOAD_RESOURCE_QUOTAS_REQUEST;
}

export class LoadResourceQuotasResponse implements Action {
  readonly type = ResourceQuotasActionTypes.LOAD_RESOURCE_QUOTAS_RESPONSE;

  constructor(readonly payload: ResourceQuota[]) {}
}

export type Actions = LoadResourceQuotasRequest | LoadResourceQuotasResponse;
