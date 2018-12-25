import { Action } from '@ngrx/store';

export enum AuthActionTypes {
  IdleLogout = '[Idle monitor] Logout',
  Logout = '[Auth] Logout',
  LogoutComplete = '[Auth API] Logout complete',
}

export class IdleLogout implements Action {
  readonly type = AuthActionTypes.IdleLogout;
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
}

export class LogoutComplete implements Action {
  readonly type = AuthActionTypes.LogoutComplete;
}

export type AuthActionsUnion = IdleLogout | Logout | LogoutComplete;
