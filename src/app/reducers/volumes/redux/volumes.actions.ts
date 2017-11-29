import { Action } from '@ngrx/store';
import { Volume } from '../../../shared/models/volume.model';

export const LOAD_VOLUMES_REQUEST = '[VOLUMES] LOAD_VOLUMES_REQUEST';
export const LOAD_VOLUMES_RESPONSE = '[VOLUMES] LOAD_VOLUMES_RESPONSE';
export const VOLUME_FILTER_UPDATE = '[VOLUMES] VOLUME_FILTER_UPDATE';
export const LOAD_SELECTED_VOLUME = '[VOLUMES] LOAD_SELECTED_VOLUME';
export const CREATE_VOLUME = '[VOLUMES] CREATE_VOLUME';
export const DELETE_VOLUME = '[VOLUMES] DELETE_VOLUME';
export const UPDATE_VOLUME = '[VOLUMES] UPDATE_VOLUME';
export const ATTACH_VOLUME = '[VOLUMES] ATTACH_VOLUME';
export const DETACH_VOLUME = '[VOLUMES] DETACH_VOLUME';
export const RESIZE_VOLUME = '[VOLUMES] RESIZE_VOLUME';
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

  constructor(public payload: any ) {
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

export class CreateVolume implements Action {
  readonly type = CREATE_VOLUME;

  constructor(public payload: any) {
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

export class AttachVolume implements Action {
  readonly type = ATTACH_VOLUME;

  constructor(public payload: any) {
  }
}

export class DetachVolume implements Action {
  readonly type = DETACH_VOLUME;

  constructor(public payload: any) {
  }
}

export class ResizeVolume implements Action {
  readonly type = RESIZE_VOLUME;

  constructor(public payload: any) {
  }
}

export class CreateSuccess implements Action {
  readonly type = VOLUME_CREATE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class DeleteSuccess implements Action {
  readonly type = VOLUME_DELETE_SUCCESS;

  constructor(public payload: Volume) {
  }
}

export class VolumeUpdateError implements Action {
  readonly type = VOLUME_UPDATE_ERROR;

  constructor(public payload: any) {
  }
}

export class CreateError implements Action {
  readonly type = VOLUME_CREATE_ERROR;

  constructor(public payload: any) {
  }
}

export class ChangeDescription implements Action {
  readonly type = VOLUME_CHANGE_DESCRIPTION;

  constructor(public payload: any) {
  }
}


export type Actions = LoadVolumesRequest
  | LoadVolumesResponse
  | VolumeFilterUpdate
  | LoadSelectedVolume
  | CreateVolume
  | CreateSuccess
  | CreateError
  | UpdateVolume
  | AttachVolume
  | DetachVolume
  | ResizeVolume;
