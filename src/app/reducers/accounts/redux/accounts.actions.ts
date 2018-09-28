import { Action } from '@ngrx/store';
import { AccountUser, ApiKeys } from '../../../shared/models/account-user.model';
import { Account, AccountData } from '../../../shared/models/account.model';

export const LOAD_ACCOUNTS_REQUEST = '[ACCOUNTS] LOAD_ACCOUNTS_REQUEST';
export const LOAD_ACCOUNTS_RESPONSE = '[ACCOUNTS] LOAD_ACCOUNTS_RESPONSE';
export const ACCOUNT_FILTER_UPDATE = '[ACCOUNTS] ACCOUNT_FILTER_UPDATE';
export const LOAD_SELECTED_ACCOUNT = '[ACCOUNTS] LOAD_SELECTED_ACCOUNT';
export const CREATE_ACCOUNT = '[ACCOUNTS] CREATE_ACCOUNT';
export const ACCOUNT_CREATE_SUCCESS = '[ACCOUNTS] CREATE_SUCCESS';
export const ACCOUNT_CREATE_ERROR = '[ACCOUNTS] CREATE_ERROR';

export const DISABLE_ACCOUNT = '[ACCOUNTS] DISABLE_ACCOUNT';
export const ENABLE_ACCOUNT = '[ACCOUNTS] ENABLE_ACCOUNT';
export const DELETE_ACCOUNT = '[ACCOUNTS] DELETE_ACCOUNT';
export const ACCOUNT_DELETE_SUCCESS = '[ACCOUNTS] ACCOUNT_DELETE_SUCCESS';

export const UPDATE_ACCOUNT = '[ACCOUNTS] UPDATE_ACCOUNT';
export const ACCOUNT_UPDATE_ERROR = '[ACCOUNTS] ACCOUNT_UPDATE_ERROR';

/* ACCOUNT'S USERS */
export const ACCOUNT_USER_CREATE = '[ACCOUNTS] ACCOUNT_USER_CREATE';
export const ACCOUNT_USER_CREATE_SUCCESS = '[ACCOUNTS] ACCOUNT_USER_CREATE_SUCCESS';
export const ACCOUNT_USER_UPDATE = '[ACCOUNTS] ACCOUNT_USER_UPDATE';
export const ACCOUNT_USER_UPDATE_SUCCESS = '[ACCOUNTS] ACCOUNT_USER_UPDATE_SUCCESS';
export const ACCOUNT_USER_DELETE = '[ACCOUNTS] ACCOUNT_USER_DELETE';
export const ACCOUNT_USER_DELETE_SUCCESS = '[ACCOUNTS] ACCOUNT_USER_DELETE_SUCCESS';
export const ACCOUNT_USER_GENERATE_KEYS = '[ACCOUNTS] ACCOUNT_USER_GENERATE_KEYS';
export const ACCOUNT_LOAD_USER_KEYS = '[ACCOUNTS] ACCOUNT_LOAD_USER_KEYS';
export const ACCOUNT_LOAD_USER_KEYS_SUCCESS = '[ACCOUNTS] ACCOUNT_LOAD_USER_KEYS_SUCCESS';

export class LoadAccountsRequest implements Action {
  type = LOAD_ACCOUNTS_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadAccountsResponse implements Action {
  type = LOAD_ACCOUNTS_RESPONSE;

  constructor(public payload: Account[]) {}
}

export class LoadSelectedAccount implements Action {
  type = LOAD_SELECTED_ACCOUNT;

  constructor(public payload: string) {}
}

export class AccountFilterUpdate implements Action {
  type = ACCOUNT_FILTER_UPDATE;

  constructor(public payload: { [key: string]: any }) {}
}

export class CreateAccount implements Action {
  readonly type = CREATE_ACCOUNT;

  constructor(public payload: AccountData) {}
}

export class CreateSuccess implements Action {
  readonly type = ACCOUNT_CREATE_SUCCESS;

  constructor(public payload: Account) {}
}

export class CreateError implements Action {
  readonly type = ACCOUNT_CREATE_ERROR;

  constructor(public payload: Error) {}
}

export class UpdateAccount implements Action {
  readonly type = UPDATE_ACCOUNT;

  constructor(public payload: Account) {}
}

export class AccountUpdateError implements Action {
  readonly type = ACCOUNT_UPDATE_ERROR;

  constructor(public payload: Error) {}
}

export class EnableAccountRequest implements Action {
  readonly type = ENABLE_ACCOUNT;

  constructor(public payload: Account) {}
}

export class DisableAccountRequest implements Action {
  readonly type = DISABLE_ACCOUNT;

  constructor(public payload: Account) {}
}

export class DeleteAccountRequest implements Action {
  readonly type = DELETE_ACCOUNT;

  constructor(public payload: Account) {}
}

export class DeleteSuccess implements Action {
  readonly type = ACCOUNT_DELETE_SUCCESS;

  constructor(public payload: Account) {}
}

export class AccountUserCreate implements Action {
  readonly type = ACCOUNT_USER_CREATE;

  constructor(public payload: AccountUser) {}
}

export class AccountUserCreateSuccess implements Action {
  readonly type = ACCOUNT_USER_CREATE_SUCCESS;

  constructor(public payload: AccountUser) {}
}

export class AccountUserUpdate implements Action {
  readonly type = ACCOUNT_USER_UPDATE;

  constructor(public payload: AccountUser) {}
}

export class AccountUserUpdateSuccess implements Action {
  readonly type = ACCOUNT_USER_UPDATE_SUCCESS;

  constructor(public payload: AccountUser) {}
}

export class AccountUserDelete implements Action {
  readonly type = ACCOUNT_USER_DELETE;

  constructor(public payload: AccountUser) {}
}

export class AccountUserDeleteSuccess implements Action {
  readonly type = ACCOUNT_USER_DELETE_SUCCESS;

  constructor(public payload: AccountUser) {}
}

export class AccountUserGenerateKey implements Action {
  readonly type = ACCOUNT_USER_GENERATE_KEYS;

  constructor(public payload: AccountUser) {}
}

export class AccountLoadUserKeys implements Action {
  readonly type = ACCOUNT_LOAD_USER_KEYS;

  constructor(public payload: AccountUser) {}
}

export class AccountLoadUserKeysSuccess implements Action {
  readonly type = ACCOUNT_LOAD_USER_KEYS_SUCCESS;

  constructor(public payload: { user: AccountUser; userKeys: ApiKeys }) {}
}

export type Actions =
  | LoadAccountsRequest
  | LoadAccountsResponse
  | AccountFilterUpdate
  | LoadSelectedAccount
  | CreateAccount
  | CreateError
  | CreateSuccess
  | EnableAccountRequest
  | DisableAccountRequest
  | LoadAccountsRequest
  | DeleteAccountRequest
  | DeleteSuccess
  | UpdateAccount
  | AccountUpdateError
  | AccountUserCreate
  | AccountUserCreateSuccess
  | AccountUserUpdate
  | AccountUserUpdateSuccess
  | AccountUserDelete
  | AccountUserDeleteSuccess
  | AccountUserGenerateKey;
