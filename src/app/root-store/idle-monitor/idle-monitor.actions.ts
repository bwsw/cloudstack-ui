import { Action } from '@ngrx/store';

export enum IdleMonitorActionTypes {
  StartIdleMonitor = '[User tags loaded] Start idle monitor',
  StopIdleMonitor = '[Logout] Stop idle monitor',
  UpdateIdleMonitorTimeout = '[Session timeout change] Update idle monitor timeout',
  RefreshSessionRequest = '[Idle monitor] Refresh session request',
}

export class StartIdleMonitor implements Action {
  readonly type = IdleMonitorActionTypes.StartIdleMonitor;
}

export class StopIdleMonitor implements Action {
  readonly type = IdleMonitorActionTypes.StopIdleMonitor;
}

export class UpdateIdleMonitorTimeout implements Action {
  readonly type = IdleMonitorActionTypes.UpdateIdleMonitorTimeout;

  constructor(public payload: { timeout: number }) {}
}

export class RefreshSessionRequest implements Action {
  readonly type = IdleMonitorActionTypes.RefreshSessionRequest;
}
