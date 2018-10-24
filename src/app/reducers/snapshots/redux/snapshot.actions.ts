import { Action } from '@ngrx/store';
import { Snapshot } from '../../../shared/models';
import { Volume } from '../../../shared/models/volume.model';

export const LOAD_SNAPSHOT_REQUEST = '[Snapshots] LOAD_SNAPSHOT_REQUEST';
export const LOAD_SNAPSHOT_RESPONSE = '[Snapshots] LOAD_SNAPSHOT_RESPONSE';
export const SNAPSHOT_FILTER_UPDATE = '[Snapshots] SNAPSHOT_FILTER_UPDATE';

export const ADD_SNAPSHOT = '[Snapshots] ADD_SNAPSHOT';
export const ADD_SNAPSHOT_SUCCESS = '[Snapshots] ADD_SNAPSHOT_SUCCESS';
export const DELETE_SNAPSHOT = '[Snapshots] DELETE_SNAPSHOT';
export const DELETE_SNAPSHOTS = '[Snapshots] DELETE_SNAPSHOTS';
export const DELETE_SNAPSHOT_SUCCESS = '[Snapshots] DELETE_SNAPSHOT_SUCCESS';
export const REVERT_VOLUME_TO_SNAPSHOT = '[Snapshots] REVERT_VOLUME_TO_SNAPSHOT';
export const REVERT_VOLUME_TO_SNAPSHOT_SUCCESS = '[Snapshots] REVERT_VOLUME_TO_SNAPSHOT_SUCCESS';
export const LOAD_SELECTED_SNAPSHOT = '[Snapshots] LOAD_SELECTED_SNAPSHOT';

export const SNAPSHOT_UPDATE_ERROR = '[Snapshots] SNAPSHOT_UPDATE_ERROR';

export class LoadSnapshotRequest implements Action {
  readonly type = LOAD_SNAPSHOT_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadSnapshotResponse implements Action {
  readonly type = LOAD_SNAPSHOT_RESPONSE;

  constructor(public payload: Snapshot[]) {}
}

export class SnapshotFilterUpdate implements Action {
  readonly type = SNAPSHOT_FILTER_UPDATE;

  constructor(public payload: any) {}
}

export class AddSnapshot implements Action {
  readonly type = ADD_SNAPSHOT;

  constructor(public payload: Volume) {}
}

export class DeleteSnapshot implements Action {
  readonly type = DELETE_SNAPSHOT;

  constructor(public payload: Snapshot) {}
}

export class DeleteSnapshots implements Action {
  readonly type = DELETE_SNAPSHOTS;

  constructor(public payload: Snapshot[]) {}
}

export class AddSnapshotSuccess implements Action {
  readonly type = ADD_SNAPSHOT_SUCCESS;

  constructor(public payload: Snapshot) {}
}

export class DeleteSnapshotSuccess implements Action {
  readonly type = DELETE_SNAPSHOT_SUCCESS;

  constructor(public payload: Snapshot) {}
}

export class SnapshotUpdateError implements Action {
  readonly type = SNAPSHOT_UPDATE_ERROR;

  constructor(public payload: Error) {}
}

export class RevertVolumeToSnapshot implements Action {
  readonly type = REVERT_VOLUME_TO_SNAPSHOT;

  constructor(public payload: Snapshot) {}
}

export class RevertVolumeToSnapshotSuccess implements Action {
  readonly type = REVERT_VOLUME_TO_SNAPSHOT_SUCCESS;

  constructor(public payload: Snapshot) {}
}

export class LoadSelectedSnapshot implements Action {
  readonly type = LOAD_SELECTED_SNAPSHOT;

  constructor(public payload: string) {}
}

export type Actions =
  | LoadSnapshotRequest
  | LoadSnapshotResponse
  | SnapshotFilterUpdate
  | AddSnapshot
  | DeleteSnapshot
  | AddSnapshotSuccess
  | DeleteSnapshotSuccess
  | SnapshotUpdateError
  | RevertVolumeToSnapshot
  | RevertVolumeToSnapshotSuccess
  | LoadSelectedSnapshot;
