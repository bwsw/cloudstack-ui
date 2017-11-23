import { Action } from '@ngrx/store';
import { VirtualMachine } from '../../../vm/shared/vm.model';
import { INotification } from '../../../shared/services/jobs-notification.service';

export const LOAD_VM_REQUEST = '[VM] LOAD_VM_REQUEST';
export const LOAD_VMS_REQUEST = '[VM] LOAD_VMS_REQUEST';
export const LOAD_VMS_RESPONSE = '[VM] LOAD_VMS_RESPONSE';
export const VM_FILTER_UPDATE = '[VM] VM_FILTER_UPDATE';
export const LOAD_SELECTED_VM = '[VM] LOAD_SELECTED_VM';
export const VM_CHANGE_DESCRIPTION = '[VM] VM_CHANGE_DESCRIPTION';
export const VM_CHANGE_SERVICE_OFFERING = '[VM] VM_CHANGE_SERVICE_OFFERING';
export const VM_CHANGE_AFFINITY_GROUP = '[VM] VM_CHANGE_AFFINITY_GROUP';
export const VM_CHANGE_INSTANT_GROUP = '[VM] VM_CHANGE_INSTANT_GROUP';
export const VM_ADD_SECONDARY_IP = '[VM] VM_ADD_SECONDARY_IP';
export const VM_REMOVE_SECONDARY_IP = '[VM] VM_REMOVE_SECONDARY_IP';
export const VM_CHANGE_COLOR = '[VM] VM_CHANGE_COLOR';
export const UPDATE_VM = '[VM] UPDATE_VM';
export const ATTACH_ISO = '[VM] ATTACH_ISO';
export const DETACH_ISO = '[VM] DETACH_ISO';
export const STOP_VM = '[VM] STOP_VM';
export const START_VM = '[VM] START_VM';
export const RESTORE_VM = '[VM] RESTORE_VM';
export const RESET_PASSWORD_VM = '[VM] RESET_PASSWORD_VM';
export const SAVE_NEW_VM_PASSWORD = '[VM] SAVE_NEW_VM_PASSWORD';
export const REBOOT_VM = '[VM] REBOOT_VM';
export const DESTROY_VM = '[VM] DESTROY_VM';
export const RECOVER_VM = '[VM] RECOVER_VM';
export const EXPUNGE_VM = '[VM] EXPUNGE_VM';
export const EXPUNGE_VM_SUCCESS = '[VM] EXPUNGE_VM_SUCCESS';
export const CREATE_VM_SUCCESS = '[VM] CREATE_VM_SUCCESS';
export const CHANGE_SSH_KEY = '[VM] CHANGE_SSH_KEY';
export const VM_UPDATE_ERROR = '[VM] VM_UPDATE_ERROR';

export class LoadVMsRequest implements Action {
  type = LOAD_VMS_REQUEST;

  constructor(public payload?: any) {
  }

}

export class LoadVMRequest implements Action {
  type = LOAD_VM_REQUEST;

  constructor(public payload: any) {
  }

}

export class LoadVMsResponse implements Action {
  type = LOAD_VMS_RESPONSE;

  constructor(public payload: any ) {
  }

}

export class VMFilterUpdate implements Action {
  type = VM_FILTER_UPDATE;

  constructor(public payload: { [key: string]: any }) {
  }

}

export class LoadSelectedVM implements Action {
  type = LOAD_SELECTED_VM;

  constructor(public payload: string) {
  }

}

export class ChangeDescription implements Action {
  type = VM_CHANGE_DESCRIPTION;

  constructor(public payload: any) {
  }

}

export class ChangeServiceOffering implements Action {
  type = VM_CHANGE_SERVICE_OFFERING;

  constructor(public payload: any) {
  }

}

export class ChangeAffinityGroup implements Action {
  type = VM_CHANGE_AFFINITY_GROUP;

  constructor(public payload: any) {
  }

}

export class ChangeInstantGroup implements Action {
  type = VM_CHANGE_INSTANT_GROUP;

  constructor(public payload: any) {
  }

}

export class AddSecondaryIp implements Action {
  type = VM_ADD_SECONDARY_IP;

  constructor(public payload: any) {
  }

}

export class RemoveSecondaryIp implements Action {
  type = VM_REMOVE_SECONDARY_IP;

  constructor(public payload: any) {
  }

}

export class ChangeVmColor implements Action {
  type = VM_CHANGE_COLOR;

  constructor(public payload: any) {
  }

}

export class UpdateVM implements Action {
  readonly type = UPDATE_VM;

  constructor(public payload: VirtualMachine, public notification?: INotification) {
  }
}

export class AttachIso implements Action {
  readonly type = ATTACH_ISO;

  constructor(public payload: any) {
  }
}

export class DetachIso implements Action {
  readonly type = DETACH_ISO;

  constructor(public payload: any) {
  }
}

export class StopVm implements Action {
  readonly type = STOP_VM;

  constructor(public payload: VirtualMachine) {
  }
}

export class StartVm implements Action {
  readonly type = START_VM;

  constructor(public payload: VirtualMachine) {
  }
}

export class RestoreVm implements Action {
  readonly type = RESTORE_VM;

  constructor(public payload: VirtualMachine) {
  }
}

export class ResetPasswordVm implements Action {
  readonly type = RESET_PASSWORD_VM;

  constructor(public payload: VirtualMachine) {
  }
}

export class SaveNewPassword implements Action {
  readonly type = SAVE_NEW_VM_PASSWORD;

  constructor(public payload: any) {
  }
}

export class RebootVm implements Action {
  readonly type = REBOOT_VM;

  constructor(public payload: VirtualMachine) {
  }
}

export class DestroyVm implements Action {
  readonly type = DESTROY_VM;

  constructor(public payload: VirtualMachine) {
  }
}

export class RecoverVm implements Action {
  readonly type = RECOVER_VM;

  constructor(public payload: VirtualMachine) {
  }
}

export class ExpungeVm implements Action {
  readonly type = EXPUNGE_VM;

  constructor(public payload: VirtualMachine) {
  }
}

export class ExpungeVmSuccess implements Action {
  readonly type = EXPUNGE_VM_SUCCESS;

  constructor(public payload: VirtualMachine, public notification: INotification) {
  }
}

export class CreateVmSuccess implements Action {
  readonly type = CREATE_VM_SUCCESS;

  constructor(public payload: VirtualMachine) {
  }
}

export class ChangeSshKey implements Action {
  readonly type = CHANGE_SSH_KEY;

  constructor(public payload: any) {
  }
}

export class VMUpdateError implements Action {
  readonly type = VM_UPDATE_ERROR;

  constructor(public payload: any, public notification: INotification) {
  }
}

export type Actions = LoadVMsRequest
  | LoadVMsResponse
  | LoadVMRequest
  | VMFilterUpdate
  | LoadSelectedVM
  | ChangeDescription
  | ChangeServiceOffering
  | ChangeAffinityGroup
  | ChangeInstantGroup
  | AddSecondaryIp
  | RemoveSecondaryIp
  | ChangeVmColor
  | UpdateVM
  | AttachIso
  | DetachIso
  | StopVm
  | StartVm
  | RestoreVm
  | ResetPasswordVm
  | SaveNewPassword
  | RebootVm
  | DestroyVm
  | RecoverVm
  | ExpungeVm
  | ExpungeVmSuccess
  | CreateVmSuccess
  | ChangeSshKey
  | VMUpdateError;
