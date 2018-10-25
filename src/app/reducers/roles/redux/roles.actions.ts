import { Action } from '@ngrx/store';

export const LOAD_ROLES_REQUEST = '[ROLES] LOAD_ROLES_REQUEST';
export const LOAD_ROLES_RESPONSE = '[ROLES] LOAD_ROLES_RESPONSE';

export class LoadRolesRequest implements Action {
  type = LOAD_ROLES_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadRolesResponse implements Action {
  type = LOAD_ROLES_RESPONSE;

  constructor(public payload: any) {}
}

export type Actions = LoadRolesResponse | LoadRolesRequest;
