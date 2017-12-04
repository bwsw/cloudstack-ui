import { Action } from '@ngrx/store';
import { VirtualMachine } from '../../../vm';
import { ServiceOffering, InstanceGroup, SSHKeyPair, Color } from '../../../shared/models';

export const LOAD_VM_REQUEST = '[VM] LOAD_VM_REQUEST';
export const LOAD_VMS_REQUEST = '[VM] LOAD_VMS_REQUEST';
export const LOAD_VMS_RESPONSE = '[VM] LOAD_VMS_RESPONSE';
export const VM_FILTER_UPDATE = '[VM] VM_FILTER_UPDATE';
export const VM_ATTACHMENT_FILTER_UPDATE = '[VM] VM_ATTACHMENT_FILTER_UPDATE';
export const LOAD_SELECTED_VM = '[VM] LOAD_SELECTED_VM';
export const VM_CHANGE_DESCRIPTION = '[VM] VM_CHANGE_DESCRIPTION';
export const VM_CHANGE_SERVICE_OFFERING = '[VM] VM_CHANGE_SERVICE_OFFERING';
export const VM_CHANGE_AFFINITY_GROUP = '[VM] VM_CHANGE_AFFINITY_GROUP';
export const VM_CHANGE_INSTANT_GROUP = '[VM] VM_CHANGE_INSTANT_GROUP';
export const VM_REMOVE_INSTANT_GROUP = '[VM] VM_REMOVE_INSTANT_GROUP';
export const VM_ADD_SECONDARY_IP = '[VM] VM_ADD_SECONDARY_IP';
export const VM_REMOVE_SECONDARY_IP = '[VM] VM_REMOVE_SECONDARY_IP';
export const VM_CHANGE_COLOR = '[VM] VM_CHANGE_COLOR';
export const UPDATE_VM = '[VM] UPDATE_VM';
export const REPLACE_VM = '[VM] REPLACE_VM';
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
export const WEB_SHELL_VM = '[VM] WEB_SHELL_VM';
export const ACCESS_VM = '[VM] ACCESS_VM';
export const PULSE_VM = '[VM] PULSE_VM';
export const CONSOLE_VM = '[VM] CONSOLE_VM';
export const OPEN_URL_VM = '[VM] OPEN_URL_VM';
export const EXPUNGE_VM = '[VM] EXPUNGE_VM';
export const EXPUNGE_VM_SUCCESS = '[VM] EXPUNGE_VM_SUCCESS';
export const CREATE_VM_SUCCESS = '[VM] CREATE_VM_SUCCESS';
export const CHANGE_SSH_KEY = '[VM] CHANGE_SSH_KEY';
export const VM_UPDATE_ERROR = '[VM] VM_UPDATE_ERROR';

export const VM_FORM_UPDATE = '[VM creation] VM_FORM_UPDATE';

export class LoadVMsRequest implements Action {
  type = LOAD_VMS_REQUEST;

  constructor(public payload?: any) {
  }

}

export class LoadVMRequest implements Action {
  type = LOAD_VM_REQUEST;

  constructor(public payload?: any) {
  }

}

export class LoadVMsResponse implements Action {
  type = LOAD_VMS_RESPONSE;

  constructor(public payload: VirtualMachine[]) {
  }

}

export class VMFilterUpdate implements Action {
  type = VM_FILTER_UPDATE;

  constructor(public payload: { [key: string]: any }) {
  }

}

export class VMAttachmentFilterUpdate implements Action {
  type = VM_ATTACHMENT_FILTER_UPDATE;

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

  constructor(public payload: {
    vm: VirtualMachine,
    description: string
  }) {
  }

}

export class ChangeServiceOffering implements Action {
  type = VM_CHANGE_SERVICE_OFFERING;

  constructor(public payload: {
    vm: VirtualMachine,
    offering: ServiceOffering
  }) {
  }

}

export class ChangeAffinityGroup implements Action {
  type = VM_CHANGE_AFFINITY_GROUP;

  constructor(public payload: {
    vm: VirtualMachine,
    affinityGroupId: string
  }) {
  }

}

export class ChangeInstanceGroup implements Action {
  type = VM_CHANGE_INSTANT_GROUP;

  constructor(public payload: {
    vm: VirtualMachine,
    group: InstanceGroup
  }) {
  }

}

export class RemoveInstanceGroup implements Action {
  type = VM_REMOVE_INSTANT_GROUP;

  constructor(public payload: VirtualMachine) {
  }

}

export class AddSecondaryIp implements Action {
  type = VM_ADD_SECONDARY_IP;

  constructor(public payload: {
    vm: VirtualMachine,
    nicId: string
  }) {
  }

}

export class RemoveSecondaryIp implements Action {
  type = VM_REMOVE_SECONDARY_IP;

  constructor(public payload: {
    vm: VirtualMachine,
    id: string
  }) {
  }

}

export class ChangeVmColor implements Action {
  type = VM_CHANGE_COLOR;

  constructor(public payload: {
    vm: VirtualMachine,
    color: Color
  }) {
  }

}

export class UpdateVM implements Action {
  readonly type = UPDATE_VM;

  constructor(public payload: VirtualMachine) {
  }
}

export class ReplaceVM implements Action {
  readonly type = REPLACE_VM;

  constructor(public payload: VirtualMachine) {
  }
}

export class AttachIso implements Action {
  readonly type = ATTACH_ISO;

  constructor(public payload: {
    id: string,
    virtualMachineId: string
  }) {
  }
}

export class DetachIso implements Action {
  readonly type = DETACH_ISO;

  constructor(public payload: {
    virtualMachineId: string
  }) {
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

  constructor(public payload: {
    vm: VirtualMachine,
    tag: { key: string, value: string }
  }) {
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

export class AccessVm implements Action {
  readonly type = ACCESS_VM;

  constructor(public payload: VirtualMachine) {
  }
}

export class WebShellVm implements Action {
  readonly type = WEB_SHELL_VM;

  constructor(public payload: VirtualMachine) {
  }
}

export class PulseVm implements Action {
  readonly type = PULSE_VM;

  constructor(public payload: VirtualMachine) {
  }
}

export class ConsoleVm implements Action {
  readonly type = CONSOLE_VM;

  constructor(public payload: VirtualMachine) {
  }
}

export class OpenUrlVm implements Action {
  readonly type = OPEN_URL_VM;

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

  constructor(public payload: VirtualMachine) {
  }
}

export class CreateVmSuccess implements Action {
  readonly type = CREATE_VM_SUCCESS;

  constructor(public payload: VirtualMachine) {
  }
}

export class ChangeSshKey implements Action {
  readonly type = CHANGE_SSH_KEY;

  constructor(public payload: {
    vm: VirtualMachine,
    keyPair: SSHKeyPair
  }) {
  }
}

export class VMUpdateError implements Action {
  readonly type = VM_UPDATE_ERROR;

  constructor(public payload: Error) {
  }
}

export class VmFormUpdate implements Action {
  type = VM_FORM_UPDATE;

  constructor(public payload: any) {
  }
}

export type Actions = LoadVMsRequest
  | LoadVMsResponse
  | AccessVm
  | PulseVm
  | ConsoleVm
  | OpenUrlVm
  | LoadVMRequest
  | VMFilterUpdate
  | VMAttachmentFilterUpdate
  | LoadSelectedVM
  | ChangeDescription
  | ChangeServiceOffering
  | ChangeAffinityGroup
  | ChangeInstanceGroup
  | RemoveInstanceGroup
  | AddSecondaryIp
  | RemoveSecondaryIp
  | ChangeVmColor
  | UpdateVM
  | ReplaceVM
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
  | VMUpdateError
  | VmFormUpdate;
