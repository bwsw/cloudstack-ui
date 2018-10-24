import { Action } from '@ngrx/store';
import { Volume, VolumeCreationData } from '../../../shared/models/volume.model';
import { VolumeFromSnapshotCreationData } from '../../../shared/services/volume.service';
import { VirtualMachine } from '../../../vm';

export const LOAD_VOLUMES_REQUEST = '[VOLUMES] LOAD_VOLUMES_REQUEST';
export const LOAD_VOLUMES_RESPONSE = '[VOLUMES] LOAD_VOLUMES_RESPONSE';
export const VOLUME_FILTER_UPDATE = '[VOLUMES] VOLUME_FILTER_UPDATE';
export const LOAD_SELECTED_VOLUME = '[VOLUMES] LOAD_SELECTED_VOLUME';
export const CREATE_VOLUME = '[VOLUMES] CREATE_VOLUME';
export const CREATE_VOLUME_FROM_SNAPSHOT = '[VOLUMES] CREATE_VOLUME_FROM_SNAPSHOT';
export const CREATE_VOLUME_FROM_SNAPSHOT_SUCCESS = '[VOLUMES] CREATE_VOLUME_FROM_SNAPSHOT_SUCCESS';
export const DELETE_VOLUME = '[VOLUMES] DELETE_VOLUME';
export const DELETE_VOLUMES = '[VOLUMES] DELETE_VOLUMES';
export const UPDATE_VOLUME = '[VOLUMES] UPDATE_VOLUME';
export const REPLACE_VOLUME = '[VOLUMES] REPLACE_VOLUME';
export const ATTACH_VOLUME = '[VOLUMES] ATTACH_VOLUME';
export const ATTACH_VOLUME_TO_VM = '[VOLUMES] ATTACH_VOLUME_TO_VM';
export const DETACH_VOLUME = '[VOLUMES] DETACH_VOLUME';
export const RESIZE_VOLUME = '[VOLUMES] RESIZE_VOLUME';
export const RESIZE_VOLUME_SUCCESS = '[VOLUMES] RESIZE_VOLUME_SUCCESS';
export const ADD_SNAPSHOT_SCHEDULE = '[VOLUMES] ADD_SNAPSHOT_SCHEDULE';
export const VOLUME_CREATE_SUCCESS = '[VOLUMES] VOLUME_CREATE_SUCCESS';
export const VOLUME_DELETE_SUCCESS = '[VOLUMES] VOLUME_DELETE_SUCCESS';
export const VOLUME_CREATE_ERROR = '[VOLUMES] VOLUME_CREATE_ERROR';
export const VOLUME_UPDATE_ERROR = '[VOLUMES] VOLUME_UPDATE_ERROR';
export const VOLUME_CHANGE_DESCRIPTION = '[VOLUMES] VOLUME_CHANGE_DESCRIPTION';

export class LoadVolumesRequest implements Action {
  type = LOAD_VOLUMES_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadVolumesResponse implements Action {
  type = LOAD_VOLUMES_RESPONSE;

  constructor(public payload: Volume[]) {}
}

export class LoadSelectedVolume implements Action {
  type = LOAD_SELECTED_VOLUME;

  constructor(public payload: string) {}
}

export class VolumeFilterUpdate implements Action {
  type = VOLUME_FILTER_UPDATE;

  constructor(public payload: { [key: string]: any }) {}
}

export class CreateVolume implements Action {
  readonly type = CREATE_VOLUME;

  constructor(public payload: VolumeCreationData) {}
}

export class DeleteVolume implements Action {
  readonly type = DELETE_VOLUME;

  constructor(public payload: Volume) {}
}

export class DeleteVolumes implements Action {
  readonly type = DELETE_VOLUMES;

  constructor(
    public payload: {
      vm: VirtualMachine;
      expunged: boolean;
    },
  ) {}
}

export class UpdateVolume implements Action {
  readonly type = UPDATE_VOLUME;

  constructor(public payload: Volume) {}
}

export class ReplaceVolume implements Action {
  readonly type = REPLACE_VOLUME;

  constructor(public payload: Volume) {}
}

export class AttachVolume implements Action {
  readonly type = ATTACH_VOLUME;

  constructor(public payload: Volume) {}
}

export class AttachVolumeToVM implements Action {
  readonly type = ATTACH_VOLUME_TO_VM;

  constructor(
    public payload: {
      volumeId: string;
      virtualMachineId: string;
    },
  ) {}
}

export class DetachVolume implements Action {
  readonly type = DETACH_VOLUME;

  constructor(public payload: Volume) {}
}

export class ResizeVolume implements Action {
  readonly type = RESIZE_VOLUME;

  constructor(public payload: Volume) {}
}

export class ResizeVolumeSuccess implements Action {
  readonly type = RESIZE_VOLUME_SUCCESS;

  constructor(public payload: Volume) {}
}

export class AddSnapshotSchedule implements Action {
  readonly type = ADD_SNAPSHOT_SCHEDULE;

  constructor(public payload: Volume) {}
}

export class CreateSuccess implements Action {
  readonly type = VOLUME_CREATE_SUCCESS;

  constructor(public payload: Volume) {}
}

export class DeleteSuccess implements Action {
  readonly type = VOLUME_DELETE_SUCCESS;

  constructor(public payload: Volume) {}
}

export class VolumeUpdateError implements Action {
  readonly type = VOLUME_UPDATE_ERROR;

  constructor(public payload: Error) {}
}

export class CreateError implements Action {
  readonly type = VOLUME_CREATE_ERROR;

  constructor(public payload: Error) {}
}

export class ChangeDescription implements Action {
  readonly type = VOLUME_CHANGE_DESCRIPTION;

  constructor(
    public payload: {
      volume: Volume;
      description: string;
    },
  ) {}
}

export class CreateVolumeFromSnapshot implements Action {
  readonly type = CREATE_VOLUME_FROM_SNAPSHOT;

  constructor(public payload: VolumeFromSnapshotCreationData) {}
}

export class CreateVolumeFromSnapshotSuccess implements Action {
  readonly type = CREATE_VOLUME_FROM_SNAPSHOT_SUCCESS;

  constructor(public payload: Volume) {}
}

export type Actions =
  | LoadVolumesRequest
  | LoadVolumesResponse
  | VolumeFilterUpdate
  | LoadSelectedVolume
  | CreateVolume
  | CreateSuccess
  | CreateError
  | UpdateVolume
  | ReplaceVolume
  | AttachVolume
  | AttachVolumeToVM
  | DeleteVolume
  | DeleteVolumes
  | DetachVolume
  | ResizeVolume
  | ChangeDescription
  | CreateVolumeFromSnapshot;
