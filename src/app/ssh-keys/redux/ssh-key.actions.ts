import { Action } from '@ngrx/store';
import { SSHKeyPair } from '../../shared/models/ssh-keypair.model';

export const LOAD_SSH_KEYS_REQUEST = '[SshKeys] LOAD_SSH_KEYS_REQUEST';
export const LOAD_SSH_KEYS_RESPONSE = '[SshKeys] LOAD_SSH_KEYS_RESPONSE';
export const SSH_KEY_FILTER_UPDATE = '[SshKeys] SSH_KEY_FILTER_UPDATE';
export const SSH_KEY_PAIR_REMOVE = '[SshKeys] SSH_KEY_PAIR_REMOVE';
export const SSH_KEY_PAIR_REMOVE_SUCCESS = '[SshKeys] SSH_KEY_PAIR_REMOVE_SUCCESS';
export const SSH_KEY_PAIR_REMOVE_ERROR = '[SshKeys] SSH_KEY_PAIR_REMOVE_ERROR';
export const SSH_KEY_PAIR_REMOVE_SUCCESS_NAVIGATION = '[SshKeys] SSH_KEY_PAIR_REMOVE_SUCCESS_NAVIGATION';
export const SSH_KEY_PAIR_CREATE = '[SshKeys] SSH_KEY_PAIR_CREATE';
export const SSH_KEY_PAIR_CREATE_SUCCESS = '[SshKeys] SSH_KEY_PAIR_CREATE_SUCCESS';
export const SSH_KEY_PAIR_CREATE_ERROR = '[SshKeys] SSH_KEY_PAIR_CREATE_ERROR';

export class LoadSshKeyRequest implements Action {
  readonly type = LOAD_SSH_KEYS_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadSshKeyResponse implements Action {
  readonly type = LOAD_SSH_KEYS_RESPONSE;

  constructor(public payload: any) {
  }
}

export class SshKeyFilterUpdate implements Action {
  readonly type = SSH_KEY_FILTER_UPDATE;

  constructor(public payload: any) {
  }
}

export class RemoveSshKeyPair implements Action {
  readonly type = SSH_KEY_PAIR_REMOVE;

  constructor(public payload: any) {
  }
}

export class RemoveSshKeyPairSuccessAction implements Action {
  readonly type = SSH_KEY_PAIR_REMOVE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class RemoveSshKeyPairSuccessNavigation implements Action {
  readonly type = SSH_KEY_PAIR_REMOVE_SUCCESS_NAVIGATION;

  constructor(public payload?: any) {
  }
}


export class RemoveSshKeyPairErrorAction implements Action {
  readonly type = SSH_KEY_PAIR_REMOVE_ERROR;

  constructor(public payload?: any) {
  }
}

export class CreateSshKeyPair implements Action {
  readonly type = SSH_KEY_PAIR_CREATE;

  constructor(public payload: any) {
  }
}

export class CreateSshKeyPairSuccessAction implements Action {
  readonly type = SSH_KEY_PAIR_CREATE_SUCCESS;

  constructor(public payload: SSHKeyPair) {
  }
}

export class CreateSshKeyPairErrorAction implements Action {
  readonly type = SSH_KEY_PAIR_CREATE_ERROR;

  constructor(public payload: Error) {
  }
}


export type Actions =
  LoadSshKeyRequest
  | LoadSshKeyResponse
  | SshKeyFilterUpdate
  | RemoveSshKeyPair
  | RemoveSshKeyPairSuccessAction
  | RemoveSshKeyPairSuccessNavigation
  | RemoveSshKeyPairErrorAction
  | CreateSshKeyPair
  | CreateSshKeyPairSuccessAction
  | CreateSshKeyPairSuccessAction
  | CreateSshKeyPairErrorAction;
