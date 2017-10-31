import { Action } from '@ngrx/store';

export const LOAD_ACCOUNTS_REQUEST = '[ACCOUNTS] LOAD_ACCOUNTS_REQUEST';
export const LOAD_ACCOUNTS_RESPONSE = '[ACCOUNTS] LOAD_ACCOUNTS_RESPONSE';
export const ACCOUNT_FILTER_UPDATE = '[ACCOUNTS] ACCOUNT_FILTER_UPDATE';
export const LOAD_SELECTED_ACCOUNT = '[ACCOUNTS] LOAD_SELECTED_ACCOUNT';
export const LOAD_USER_ACCOUNT = '[ACCOUNTS] LOAD_USER_ACCOUNT';

export class LoadAccountsRequest implements Action {
  type = LOAD_ACCOUNTS_REQUEST;

  constructor(public payload?: any) {
  }

}

export class LoadAccountsResponse implements Action {
  type = LOAD_ACCOUNTS_RESPONSE;

  constructor(public payload: any ) {
  }

}

export class LoadSelectedAccount implements Action {
  type = LOAD_SELECTED_ACCOUNT;

  constructor(public payload: string) {
  }

}

export class LoadUserAccount implements Action {
  type = LOAD_USER_ACCOUNT;

  constructor(public payload: any) {
  }

}

export class AccountFilterUpdate implements Action {
  type = ACCOUNT_FILTER_UPDATE;

  constructor(public payload: { [key: string]: any }) {
  }

}


export type Actions = LoadAccountsRequest
  | LoadAccountsResponse
  | AccountFilterUpdate
  | LoadSelectedAccount
  | LoadUserAccount;
