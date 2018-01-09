import { Action } from '@ngrx/store';
import { Snapshot } from '../../../shared/models';
import { Volume } from '../../../shared/models/volume.model';
import { INotification } from '../../../shared/services/jobs-notification.service';

export const LOAD_SNAPSHOT_REQUEST = '[Snapshots] LOAD_SNAPSHOT_REQUEST';
export const LOAD_SNAPSHOT_RESPONSE = '[Snapshots] LOAD_SNAPSHOT_RESPONSE';

export const ADD_SNAPSHOT = '[Snapshots] ADD_SNAPSHOT';
export const ADD_SNAPSHOT_SUCCESS = '[Snapshots] ADD_SNAPSHOT_SUCCESS';
export const DELETE_SNAPSHOT = '[Snapshots] DELETE_SNAPSHOT';
export const DELETE_SNAPSHOT_SUCCESS = '[Snapshots] DELETE_SNAPSHOT_SUCCESS';

export const SNAPSHOT_UPDATE_ERROR = '[Snapshots] SNAPSHOT_UPDATE_ERROR';

export class LoadSnapshotRequest implements Action {
  readonly type = LOAD_SNAPSHOT_REQUEST;

  constructor(public payload?: any) {
  }
}

export class LoadSnapshotResponse implements Action {
  readonly type = LOAD_SNAPSHOT_RESPONSE;

  constructor(public payload: Snapshot[]) {
  }
}

export class AddSnapshot implements Action {
  readonly type = ADD_SNAPSHOT;

  constructor(public payload: Volume) {
  }
}

export class DeleteSnapshot implements Action {
  readonly type = DELETE_SNAPSHOT;

  constructor(public payload: Snapshot) {
  }
}

export class AddSnapshotSuccess implements Action {
  readonly type = ADD_SNAPSHOT_SUCCESS;

  constructor(public payload: Snapshot) {
  }
}

export class DeleteSnapshotSuccess implements Action {
  readonly type = DELETE_SNAPSHOT_SUCCESS;

  constructor(public payload: Snapshot) {
  }
}

export class SnapshotUpdateError implements Action {
  readonly type = SNAPSHOT_UPDATE_ERROR;

  constructor(public payload: INotification) {
  }
}

export type Actions =
  LoadSnapshotRequest
  | LoadSnapshotResponse
  | AddSnapshot
  | DeleteSnapshot
  | AddSnapshotSuccess
  | DeleteSnapshotSuccess
  | SnapshotUpdateError;

