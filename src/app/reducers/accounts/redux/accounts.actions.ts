import { Action } from '@ngrx/store';

export const LOAD_ACCOUNTS_REQUEST = '[ACCOUNTS] LOAD_ACCOUNTS_REQUEST';
export const LOAD_ACCOUNTS_RESPONSE = '[ACCOUNTS] LOAD_ACCOUNTS_RESPONSE';
export const ACCOUNT_FILTER_UPDATE = '[ACCOUNTS] ACCOUNT_FILTER_UPDATE';
export const LOAD_SELECTED_ACCOUNT = '[ACCOUNTS] LOAD_SELECTED_ACCOUNT';
export const CREATE_ACCOUNT = '[ACCOUNTS] CREATE_ACCOUNT';
export const ACCOUNT_CREATE_SUCCESS = '[ACCOUNTS] CREATE_SUCCESS';
export const ACCOUNT_CREATE_ERROR = '[ACCOUNTS] CREATE_ERROR';

export const DISABLE_ACCOUNT = '[ACCOUNTS] DISABLE_ACCOUNT';
export const ENABLE_ACCOUNT = '[ACCOUNTS] ENABLE_ACCOUNT';
export const LOCK_ACCOUNT = '[ACCOUNTS] LOCK_ACCOUNT';
export const DELETE_ACCOUNT = '[ACCOUNTS] DELETE_ACCOUNT';
export const ACCOUNT_DELETE_SUCCESS = '[ACCOUNTS] ACCOUNT_DELETE_SUCCESS';

export const UPDATE_ACCOUNT = '[ACCOUNTS] UPDATE_ACCOUNT';
export const ACCOUNT_UPDATE_ERROR = '[ACCOUNTS] ACCOUNT_UPDATE_ERROR';

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

export class AccountFilterUpdate implements Action {
  type = ACCOUNT_FILTER_UPDATE;

  constructor(public payload: { [key: string]: any }) {
  }

}

export class CreateAccount implements Action {
  readonly type = CREATE_ACCOUNT;

  constructor(public payload: any) {
  }
}

export class CreateSuccess implements Action {
  readonly type = ACCOUNT_CREATE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class CreateError implements Action {
  readonly type = ACCOUNT_CREATE_ERROR;

  constructor(public payload: any) {
  }
}

export class UpdateAccount implements Action {
  readonly type = UPDATE_ACCOUNT;

  constructor(public payload: any) {
  }
}

export class AccountUpdateError implements Action {
  readonly type = ACCOUNT_UPDATE_ERROR;

  constructor(public payload: any) {
  }
}

export class EnableAccountRequest implements Action {
  readonly type = ENABLE_ACCOUNT;

  constructor(public payload: any) {
  }
}

export class DisableAccountRequest implements Action {
  readonly type = DISABLE_ACCOUNT;

  constructor(public payload: any) {
  }
}

export class LockAccountRequest implements Action {
  readonly type = LOCK_ACCOUNT;

  constructor(public payload: any) {
  }
}

export class DeleteAccountRequest implements Action {
  readonly type = DELETE_ACCOUNT;

  constructor(public payload: any) {
  }
}

export class DeleteSuccess implements Action {
  readonly type = ACCOUNT_DELETE_SUCCESS;

  constructor(public payload: any) {
  }
}



export type Actions = LoadAccountsRequest
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
  | AccountUpdateError;
