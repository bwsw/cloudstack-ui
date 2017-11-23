import { Action } from '@ngrx/store';

export const LOAD_USER_ACCOUNT_REQUEST = '[USER ACCOUNT] LOAD_USER_ACCOUNT_REQUEST';
export const LOAD_USER_ACCOUNT_RESPONSE = '[USER ACCOUNT] LOAD_USER_ACCOUNT_RESPONSE';
export const LOG_OUT_USER_ACCOUNT = '[USER ACCOUNT] LOG_OUT_USER_ACCOUNT';


export class LoadUserAccountRequest implements Action {
  type = LOAD_USER_ACCOUNT_REQUEST;

  constructor(public payload?: any) {
  }

}

export class LoadUserAccountResponse implements Action {
  type = LOAD_USER_ACCOUNT_RESPONSE;

  constructor(public payload: any ) {
  }

}

export class LogOutUserAccount implements Action {
  type = LOG_OUT_USER_ACCOUNT;

  constructor(public payload?: any) {
  }

}

export type Actions = LoadUserAccountRequest
  | LoadUserAccountResponse
  | LogOutUserAccount;
