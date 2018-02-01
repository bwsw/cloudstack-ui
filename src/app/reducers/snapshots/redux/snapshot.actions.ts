import { Action } from '@ngrx/store';
import { Snapshot } from '../../../shared/models';
import { Volume } from '../../../shared/models/volume.model';

export const LOAD_SNAPSHOT_REQUEST = '[SNAPSHOTS] LOAD_SNAPSHOT_REQUEST';
export const LOAD_SNAPSHOT_RESPONSE = '[SNAPSHOTS] LOAD_SNAPSHOT_RESPONSE';

export const ADD_SNAPSHOT = '[SNAPSHOTS] ADD_SNAPSHOT';
export const ADD_SNAPSHOT_SUCCESS = '[SNAPSHOTS] ADD_SNAPSHOT_SUCCESS';
export const DELETE_SNAPSHOT = '[SNAPSHOTS] DELETE_SNAPSHOT';
export const DELETE_SNAPSHOTS = '[SNAPSHOTS] DELETE_SNAPSHOTS';
export const DELETE_SNAPSHOT_SUCCESS = '[SNAPSHOTS] DELETE_SNAPSHOT_SUCCESS';

export const SNAPSHOT_UPDATE_ERROR = '[SNAPSHOTS] SNAPSHOT_UPDATE_ERROR';

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

export class DeleteSnapshots implements Action {
  readonly type = DELETE_SNAPSHOTS;

  constructor(public payload: Array<Snapshot>) {
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

  constructor(public payload: Error) {
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

