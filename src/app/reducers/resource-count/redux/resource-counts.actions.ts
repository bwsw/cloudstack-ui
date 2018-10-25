import { Action } from '@ngrx/store';

export const LOAD_RESOURCE_COUNTS_REQUEST = '[RESOURCE_COUNTS] LOAD_RESOURCE_COUNTS_REQUEST';
export const LOAD_RESOURCE_COUNTS_RESPONSE = '[RESOURCE_COUNTS] LOAD_RESOURCE_COUNTS_RESPONSE';

export class LoadResourceCountsRequest implements Action {
  type = LOAD_RESOURCE_COUNTS_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadResourceCountsResponse implements Action {
  type = LOAD_RESOURCE_COUNTS_RESPONSE;

  constructor(public payload: any) {}
}

export type Actions = LoadResourceCountsResponse | LoadResourceCountsRequest;
