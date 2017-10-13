import { Action } from '@ngrx/store';

export const LOAD_ACCOUNTS_REQUEST = '[ACCOUNTS] LOAD_ACCOUNTS_REQUEST';
export const LOAD_ACCOUNTS_RESPONSE = '[ACCOUNTS] LOAD_ACCOUNTS_RESPONSE';
export const ACCOUNT_FILTER_UPDATE = '[ACCOUNTS] ACCOUNT_FILTER_UPDATE';
export const LOAD_SELECTED_ACCOUNT_REQUEST = '[ACCOUNTS] LOAD_SELECTED_ACCOUNT_REQUEST';
export const LOAD_SELECTED_ACCOUNT_RESPONSE = '[ACCOUNTS] LOAD_SELECTED_ACCOUNT_RESPONSE';

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

export class LoadSelectedAccountRequest implements Action {
  type = LOAD_SELECTED_ACCOUNT_REQUEST;

  constructor(public payload: any) {
  }

}

export class LoadSelectedAccountResponse implements Action {
  type = LOAD_SELECTED_ACCOUNT_RESPONSE;

  constructor(public payload: any ) {
  }

}

export class AccountFilterUpdate implements Action {
  type = ACCOUNT_FILTER_UPDATE;

  constructor(public payload: { [key: string]: any }) {
  }

}


export type Actions = LoadAccountsRequest | LoadAccountsResponse | AccountFilterUpdate;
