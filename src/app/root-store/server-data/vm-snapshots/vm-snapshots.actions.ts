import { Action } from '@ngrx/store';
import { SnapshotFromVmSnapshotParams } from '../../../shared/interfaces';
import { VmSnapshot } from '../../../shared/models/vm-snapshot.model';
import { VirtualMachine } from '../../../vm';

export enum VmSnapshotActionTypes {
  Load = '[Snapshot Page] Load VM snapshots',
  LoadSuccess = '[Snapshot API] VM snapshots load success',
  LoadError = '[Snapshot API] VM snapshot load error',
  Create = '[VM sidebar] Create VM snapshot',
  CreateConfirmed = '[Creation Dialog] VM snapshot creation confirmed',
  CreateCanceled = '[Creation Dialog] VM snapshot creation canceled',
  CreateSuccess = '[Snapshot API] Create VM snapshot success',
  CreateError = '[Snapshot API] Create VM snapshot error',
  CreateVolumeSnapshot = '[Snapshot action] Create volume snapshot from VM snapshot',
  CreateVolumeSnapshotConfirmed = '[Creation Dialog] Volume snapshot creation from VM snapshot confirmed',
  CreateVolumeSnapshotCanceled = '[Creation Dialog] Volume snapshot creation from VM snapshot canceled',
  CreateVolumeSnapshotSuccess = '[Snapshot API] Create volume snapshot from VM snapshot success',
  CreateVolumeSnapshotError = '[Snapshot API] Create volume snapshot from VM snapshot error',
  Delete = '[Snapshot action] Delete VM snapshot',
  DeleteConfirmed = '[Confirmation dialog] Deleting VM snapshot confirmed',
  DeleteCanceled = '[Confirmation dialog] Deleting VM snapshot canceled',
  DeleteSuccess = '[Snapshot API] Delete VM snapshot success',
  DeleteError = '[Snapshot API] Delete VM snapshot error',
  Revert = '[Snapshot action] Revert VM to snapshot',
  RevertConfirmed = '[Confirmation dialog] Reverting VM to snapshot confirmed',
  RevertCanceled = '[Confirmation dialog] Reverting VM to snapshot canceled',
  RevertSuccess = '[Snapshot API] Revert VM to snapshot success',
  RevertError = '[Snapshot API] Revert VM to snapshot error',
}

export class Load implements Action {
  readonly type = VmSnapshotActionTypes.Load;
}

export class LoadSuccess implements Action {
  readonly type = VmSnapshotActionTypes.LoadSuccess;

  constructor(readonly payload: { snapshots: VmSnapshot[] }) {}
}

export class LoadError implements Action {
  readonly type = VmSnapshotActionTypes.LoadError;

  constructor(readonly payload: { error: Error }) {}
}

export class Create implements Action {
  readonly type = VmSnapshotActionTypes.Create;

  constructor(readonly payload: { vmId: string }) {}
}

export class CreateConfirmed implements Action {
  readonly type = VmSnapshotActionTypes.CreateConfirmed;

  constructor(
    readonly payload: { vmId: string; name: string; description: string; snapshotMemory: boolean },
  ) {}
}

export class CreateCanceled implements Action {
  readonly type = VmSnapshotActionTypes.CreateCanceled;
}

export class CreateSuccess implements Action {
  readonly type = VmSnapshotActionTypes.CreateSuccess;

  constructor(readonly payload: { vmSnapshot: VmSnapshot }) {}
}

export class CreateError implements Action {
  readonly type = VmSnapshotActionTypes.CreateError;

  constructor(readonly payload: { error: Error }) {}
}

export class CreateVolumeSnapshot implements Action {
  readonly type = VmSnapshotActionTypes.CreateVolumeSnapshot;

  constructor(readonly payload: { snapshotId: string }) {}
}

export class CreateVolumeSnapshotConfirmed implements Action {
  readonly type = VmSnapshotActionTypes.CreateVolumeSnapshotConfirmed;

  constructor(readonly payload: SnapshotFromVmSnapshotParams) {}
}

export class CreateVolumeSnapshotCanceled implements Action {
  readonly type = VmSnapshotActionTypes.CreateVolumeSnapshotCanceled;
}

export class CreateVolumeSnapshotSuccess implements Action {
  readonly type = VmSnapshotActionTypes.CreateVolumeSnapshotSuccess;

  constructor(readonly payload: { todo: any }) {} // todo
}

export class CreateVolumeSnapshotError implements Action {
  readonly type = VmSnapshotActionTypes.CreateVolumeSnapshotError;

  constructor(readonly payload: { error: Error }) {}
}

export class Delete implements Action {
  readonly type = VmSnapshotActionTypes.Delete;

  constructor(readonly payload: { id: string }) {}
}

export class DeleteConfirmed implements Action {
  readonly type = VmSnapshotActionTypes.DeleteConfirmed;

  constructor(readonly payload: { id: string }) {}
}

export class DeleteCanceled implements Action {
  readonly type = VmSnapshotActionTypes.DeleteCanceled;
}

export class DeleteSuccess implements Action {
  readonly type = VmSnapshotActionTypes.DeleteSuccess;

  constructor(readonly payload: { id: string }) {}
}

export class DeleteError implements Action {
  readonly type = VmSnapshotActionTypes.DeleteError;

  constructor(readonly payload: { error: Error }) {}
}

export class Revert implements Action {
  readonly type = VmSnapshotActionTypes.Revert;

  constructor(readonly payload: { id: string }) {}
}

export class RevertConfirmed implements Action {
  readonly type = VmSnapshotActionTypes.RevertConfirmed;

  constructor(readonly payload: { id: string }) {}
}

export class RevertCanceled implements Action {
  readonly type = VmSnapshotActionTypes.RevertCanceled;
}

export class RevertSuccess implements Action {
  readonly type = VmSnapshotActionTypes.RevertSuccess;

  constructor(readonly payload: { vm: VirtualMachine }) {}
}

export class RevertError implements Action {
  readonly type = VmSnapshotActionTypes.RevertError;

  constructor(readonly payload: { error: Error }) {}
}

export type VmSnapshotActionsUnion =
  | Load
  | LoadSuccess
  | LoadError
  | Create
  | CreateConfirmed
  | CreateCanceled
  | CreateSuccess
  | CreateError
  | CreateVolumeSnapshot
  | CreateVolumeSnapshotConfirmed
  | CreateVolumeSnapshotCanceled
  | CreateVolumeSnapshotSuccess
  | CreateVolumeSnapshotError
  | Delete
  | DeleteConfirmed
  | DeleteCanceled
  | DeleteSuccess
  | DeleteError
  | Revert
  | RevertConfirmed
  | RevertCanceled
  | RevertSuccess
  | RevertError;
