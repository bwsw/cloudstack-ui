import { Action } from '@ngrx/store';

export const LOAD_SSH_KEYS_REQUEST = '[SshKeys] LOAD_SSH_KEYS_REQUEST';
export const LOAD_SSH_KEYS_RESPONSE = '[SshKeys] LOAD_SSH_KEYS_RESPONSE';
export const SSH_KEY_FILTER_UPDATE = '[SshKeys] SSH_KEY_FILTER_UPDATE';
export const REMOVE_SSH_KEY_PAIR = '[SshKeys] REMOVE_SSH_KEY_PAIR';
export const CREATE_SSH_KEY_PAIR = '[SshKeys] CREATE_SSH_KEY_PAIR';

export class LoadSshKeyRequest implements Action {
  type = LOAD_SSH_KEYS_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadSshKeyResponse implements Action {
  type = LOAD_SSH_KEYS_RESPONSE;

  constructor(public payload: any) {
  }
}

export class SshKeyFilterUpdate implements Action {
  type = SSH_KEY_FILTER_UPDATE;

  constructor(public payload: any) {
  }
}

export class RemoveSshKeyPair implements Action {
  type = REMOVE_SSH_KEY_PAIR;

  constructor(public payload: any) {
  }
}

export class CreateSshKeyPair implements Action {
  type = CREATE_SSH_KEY_PAIR;

  constructor(public payload: any) {
  }
}

export type Actions =
  LoadSshKeyRequest
  | LoadSshKeyResponse
  | SshKeyFilterUpdate
  | RemoveSshKeyPair
  | CreateSshKeyPair;
