import { Action } from '@ngrx/store';
import {
  Volume,
  VolumeCreationData
} from '../../../shared/models/volume.model';
import { VolumeResizeData } from '../../../shared/services/volume.service';
import { Snapshot } from '../../../shared/models/snapshot.model';

export const LOAD_VOLUMES_REQUEST = '[VOLUMES] LOAD_VOLUMES_REQUEST';
export const LOAD_VOLUMES_RESPONSE = '[VOLUMES] LOAD_VOLUMES_RESPONSE';
export const VOLUME_FILTER_UPDATE = '[VOLUMES] VOLUME_FILTER_UPDATE';
export const VM_VOLUME_FILTER_UPDATE = '[VOLUMES] VM_VOLUME_FILTER_UPDATE';
export const LOAD_SELECTED_VOLUME = '[VOLUMES] LOAD_SELECTED_VOLUME';
export const CREATE_VOLUME = '[VOLUMES] CREATE_VOLUME';
export const DELETE_VOLUME = '[VOLUMES] DELETE_VOLUME';
export const UPDATE_VOLUME = '[VOLUMES] UPDATE_VOLUME';
export const REPLACE_VOLUME = '[VOLUMES] REPLACE_VOLUME';
export const ATTACH_VOLUME = '[VOLUMES] ATTACH_VOLUME';
export const DETACH_VOLUME = '[VOLUMES] DETACH_VOLUME';
export const RESIZE_VOLUME = '[VOLUMES] RESIZE_VOLUME';
export const RESIZE_VOLUME_SUCCESS = '[VOLUMES] RESIZE_VOLUME_SUCCESS';
export const ADD_SNAPSHOT = '[VOLUMES] ADD_SNAPSHOT';
export const ADD_SNAPSHOT_SUCCESS = '[VOLUMES] ADD_SNAPSHOT_SUCCESS';
export const DELETE_SNAPSHOT = '[VOLUMES] DELETE_SNAPSHOT';
export const DELETE_SNAPSHOT_SUCCESS = '[VOLUMES] DELETE_SNAPSHOT_SUCCESS';
export const VOLUME_CREATE_SUCCESS = '[VOLUMES] VOLUME_CREATE_SUCCESS';
export const VOLUME_DELETE_SUCCESS = '[VOLUMES] VOLUME_DELETE_SUCCESS';
export const VOLUME_CREATE_ERROR = '[VOLUMES] VOLUME_CREATE_ERROR';
export const VOLUME_UPDATE_ERROR = '[VOLUMES] VOLUME_UPDATE_ERROR';
export const VOLUME_CHANGE_DESCRIPTION = '[VOLUMES] VOLUME_CHANGE_DESCRIPTION';

export class LoadVolumesRequest implements Action {
  type = LOAD_VOLUMES_REQUEST;

  constructor(public payload?: any) {
  }

}

export class LoadVolumesResponse implements Action {
  type = LOAD_VOLUMES_RESPONSE;

  constructor(public payload: Volume[]) {
  }

}

export class LoadSelectedVolume implements Action {
  type = LOAD_SELECTED_VOLUME;

  constructor(public payload: string) {
  }

}

export class VolumeFilterUpdate implements Action {
  type = VOLUME_FILTER_UPDATE;

  constructor(public payload: { [key: string]: any }) {
  }

}

export class VmVolumeFilterUpdate implements Action {
  type = VM_VOLUME_FILTER_UPDATE;

  constructor(public payload: { [key: string]: any }) {
  }

}

export class CreateVolume implements Action {
  readonly type = CREATE_VOLUME;

  constructor(public payload: VolumeCreationData) {
  }
}

export class DeleteVolume implements Action {
  readonly type = DELETE_VOLUME;

  constructor(public payload: Volume) {
  }
}

export class UpdateVolume implements Action {
  readonly type = UPDATE_VOLUME;

  constructor(public payload: Volume) {
  }
}

export class ReplaceVolume implements Action {
  readonly type = REPLACE_VOLUME;

  constructor(public payload: Volume) {
  }
}

export class AttachVolume implements Action {
  readonly type = ATTACH_VOLUME;

  constructor(public payload: {
    volumeId: string,
    virtualMachineId: string
  }) {
  }
}

export class DetachVolume implements Action {
  readonly type = DETACH_VOLUME;

  constructor(public payload: Volume) {
  }
}

export class ResizeVolume implements Action {
  readonly type = RESIZE_VOLUME;

  constructor(public payload: VolumeResizeData) {
  }
}

export class ResizeVolumeSuccess implements Action {
  readonly type = RESIZE_VOLUME_SUCCESS;

  constructor(public payload: Volume) {
  }
}

export class AddSnapshot implements Action {
  readonly type = ADD_SNAPSHOT;

  constructor(public payload: {
    volume: Volume,
    name: string,
    description: string
  }) {
  }
}

export class DeleteSnapshot implements Action {
  readonly type = DELETE_SNAPSHOT;

  constructor(public payload: {
    volume: Volume,
    snapshot: Snapshot
  }) {
  }
}

export class AddSnapshotSuccess implements Action {
  readonly type = ADD_SNAPSHOT_SUCCESS;

  constructor(public payload: Volume) {
  }
}

export class DeleteSnapshotSuccess implements Action {
  readonly type = DELETE_SNAPSHOT_SUCCESS;

  constructor(public payload: Volume) {
  }
}

export class CreateSuccess implements Action {
  readonly type = VOLUME_CREATE_SUCCESS;

  constructor(public payload: Volume) {
  }
}

export class DeleteSuccess implements Action {
  readonly type = VOLUME_DELETE_SUCCESS;

  constructor(public payload: Volume) {
  }
}

export class VolumeUpdateError implements Action {
  readonly type = VOLUME_UPDATE_ERROR;

  constructor(public payload: Error) {
  }
}

export class CreateError implements Action {
  readonly type = VOLUME_CREATE_ERROR;

  constructor(public payload: Error) {
  }
}

export class ChangeDescription implements Action {
  readonly type = VOLUME_CHANGE_DESCRIPTION;

  constructor(public payload: {
    volume: Volume,
    description: string
  }) {
  }
}


export type Actions = LoadVolumesRequest
  | LoadVolumesResponse
  | VolumeFilterUpdate
  | VmVolumeFilterUpdate
  | LoadSelectedVolume
  | CreateVolume
  | CreateSuccess
  | CreateError
  | UpdateVolume
  | ReplaceVolume
  | AttachVolume
  | DetachVolume
  | ResizeVolume
  | ChangeDescription
  | AddSnapshot
  | DeleteSnapshot
  | AddSnapshotSuccess
  | DeleteSnapshotSuccess;
