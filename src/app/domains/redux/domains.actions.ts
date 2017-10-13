import { Action } from '@ngrx/store';

export const LOAD_DOMAINS_REQUEST = '[DOMAINS] LOAD_DOMAINS_REQUEST';
export const LOAD_DOMAINS_RESPONSE = '[DOMAINS] LOAD_DOMAINS_RESPONSE';
export const GET_DOMAIN = '[DOMAINS] GET_DOMAIN';

export class LoadDomainsRequest implements Action {
  type = LOAD_DOMAINS_REQUEST;

  constructor(public payload?: any) {
  }

}

export class LoadDomainsResponse implements Action {
  type = LOAD_DOMAINS_RESPONSE;

  constructor(public payload: any) {
  }
}

export class GetDomain implements Action {
  type = GET_DOMAIN;

  constructor(public payload: any) {
  }
}

export type Actions = LoadDomainsResponse
  | LoadDomainsRequest
  | GetDomain;
