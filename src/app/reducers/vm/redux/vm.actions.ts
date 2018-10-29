import { Action } from '@ngrx/store';
import { ParametrizedTranslation } from '../../../dialog/dialog-service/dialog.service';
// tslint:disable-next-line
import { ProgressLoggerMessageData } from '../../../shared/components/progress-logger/progress-logger-message/progress-logger-message';
import { Color, InstanceGroup, ServiceOffering, SSHKeyPair, Tag } from '../../../shared/models';
import { VirtualMachine } from '../../../vm';
import { VmState } from '../../../vm/shared/vm.model';
import { VmCreationState } from '../../../vm/vm-creation/data/vm-creation-state';
import { VmDeploymentMessage } from './vm-creation.effects';
import { FormState } from './vm.reducers';

export const LOAD_VM_REQUEST = '[VM] LOAD_VM_REQUEST';
export const LOAD_VMS_REQUEST = '[VM] LOAD_VMS_REQUEST';
export const LOAD_VMS_RESPONSE = '[VM] LOAD_VMS_RESPONSE';
export const LOAD_VIRTUAL_MACHINE = '[VM] Load virtual machine';
export const VIRTUAL_MACHINE_LOADED = '[VM] Virtual Machine Loaded';
export const VM_FILTER_UPDATE = '[VM] VM_FILTER_UPDATE';
export const VM_ATTACHMENT_FILTER_UPDATE = '[VM] VM_ATTACHMENT_FILTER_UPDATE';
export const LOAD_SELECTED_VM = '[VM] LOAD_SELECTED_VM';
export const VM_CHANGE_DESCRIPTION = '[VM] VM_CHANGE_DESCRIPTION';
export const VM_CHANGE_SERVICE_OFFERING = '[VM] VM_CHANGE_SERVICE_OFFERING';
export const VM_CHANGE_AFFINITY_GROUP = '[VM] VM_CHANGE_AFFINITY_GROUP';
export const VM_CHANGE_INSTANCE_GROUP = '[VM] VM_CHANGE_INSTANCE_GROUP';
export const VM_REMOVE_INSTANCE_GROUP = '[VM] VM_REMOVE_INSTANCE_GROUP';
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
export const CHANGE_SSH_KEY = '[VM] CHANGE_SSH_KEY';
export const VM_UPDATE_ERROR = '[VM] VM_UPDATE_ERROR';
export const VIEW_VM_LOGS = '[VM] VIEW_LOGS';

export const VM_FORM_INIT = '[VM creation] VM_FORM_INIT';
export const VM_FORM_CLEAN = '[VM creation] VM_FORM_CLEAN';
export const VM_FORM_UPDATE = '[VM creation] VM_FORM_UPDATE';
export const VM_FORM_ADJUST = '[VM creation] VM_FORM_ADJUST';
export const VM_INITIAL_ZONE_SELECT = '[VM creation] VM_INITIAL_ZONE_SELECT';
export const VM_SECURITY_GROUPS_SELECT = '[VM creation] VM_SECURITY_GROUPS_SELECT';
export const VM_CREATION_STATE_UPDATE = '[VM creation] VM_CREATION_STATE_UPDATE';
export const VM_CREATION_ENOUGH_RESOURCE_STATE_UPDATE =
  '[VM creation] VM_CREATION_ENOUGH_RESOURCE_STATE_UPDATE';

export const DEPLOY_VM = '[VM deployment] DEPLOY_VM';
export const VM_DEPLOYMENT_REQUEST = '[VM deployment] VM_DEPLOYMENT_REQUEST';
export const VM_DEPLOYMENT_REQUEST_SUCCESS = '[VM deployment] VM_DEPLOYMENT_REQUEST_SUCCESS';
export const VM_DEPLOYMENT_REQUEST_ERROR = '[VM deployment] VM_DEPLOYMENT_REQUEST_ERROR';
export const VM_DEPLOYMENT_CHANGE_STATUS = '[VM deployment] VM_DEPLOYMENT_CHANGE_STATUS';
export const VM_DEPLOYMENT_ADD_LOGGER_MESSAGE = '[VM deployment] VM_DEPLOYMENT_ADD_LOGGER_MESSAGE';
export const VM_DEPLOYMENT_UPDATE_LOGGER_MESSAGE =
  '[VM deployment] VM_DEPLOYMENT_UPDATE_LOGGER_MESSAGE';
export const VM_DEPLOYMENT_INIT_ACTION_LIST = '[VM deployment] VM_DEPLOYMENT_INIT_ACTION_LIST';
export const VM_DEPLOYMENT_COPY_TAGS = '[VM deployment] VM_DEPLOYMENT_COPY_TAGS';

export const SAVE_VM_PASSWORD = '[VM password component] Save VM password';
export const SAVE_VM_PASSWORD_SUCCESS = '[Resource tag API] Save VM password success';
export const SAVE_VM_PASSWORD_ERROR = '[Resource tag API] Save VM password error';

export class LoadVMsRequest implements Action {
  type = LOAD_VMS_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadVMRequest implements Action {
  type = LOAD_VM_REQUEST;

  constructor(public payload?: any) {}
}

export class LoadVirtualMachine implements Action {
  readonly type = LOAD_VIRTUAL_MACHINE;

  constructor(public payload: { id: string }) {}
}

export class VirtualMachineLoaded implements Action {
  readonly type = VIRTUAL_MACHINE_LOADED;

  constructor(public payload: { vm: VirtualMachine }) {}
}

export class LoadVMsResponse implements Action {
  type = LOAD_VMS_RESPONSE;

  constructor(public payload: VirtualMachine[]) {}
}

export class VMFilterUpdate implements Action {
  type = VM_FILTER_UPDATE;

  constructor(public payload: { [key: string]: any }) {}
}

export class VMAttachmentFilterUpdate implements Action {
  type = VM_ATTACHMENT_FILTER_UPDATE;

  constructor(public payload: { [key: string]: any }) {}
}

export class LoadSelectedVM implements Action {
  type = LOAD_SELECTED_VM;

  constructor(public payload: string) {}
}

export class ChangeDescription implements Action {
  type = VM_CHANGE_DESCRIPTION;

  constructor(
    public payload: {
      vm: VirtualMachine;
      description: string;
    },
  ) {}
}

export class ChangeServiceOffering implements Action {
  type = VM_CHANGE_SERVICE_OFFERING;

  constructor(
    public payload: {
      vm: VirtualMachine;
      offering: ServiceOffering;
    },
  ) {}
}

export class ChangeAffinityGroup implements Action {
  type = VM_CHANGE_AFFINITY_GROUP;

  constructor(
    public payload: {
      vm: VirtualMachine;
      affinityGroupIds: string[];
    },
  ) {}
}

export class ChangeInstanceGroup implements Action {
  type = VM_CHANGE_INSTANCE_GROUP;

  constructor(
    public payload: {
      vm: VirtualMachine;
      group: InstanceGroup;
    },
  ) {}
}

export class RemoveInstanceGroup implements Action {
  type = VM_REMOVE_INSTANCE_GROUP;

  constructor(public payload: VirtualMachine) {}
}

export class AddSecondaryIp implements Action {
  type = VM_ADD_SECONDARY_IP;

  constructor(
    public payload: {
      vm: VirtualMachine;
      nicId: string;
    },
  ) {}
}

export class RemoveSecondaryIp implements Action {
  type = VM_REMOVE_SECONDARY_IP;

  constructor(
    public payload: {
      vm: VirtualMachine;
      id: string;
    },
  ) {}
}

export class ChangeVmColor implements Action {
  type = VM_CHANGE_COLOR;

  constructor(
    public payload: {
      vm: VirtualMachine;
      color: Color;
    },
  ) {}
}

export class UpdateVM implements Action {
  readonly type = UPDATE_VM;

  constructor(public payload: VirtualMachine) {}
}

export class ReplaceVM implements Action {
  readonly type = REPLACE_VM;

  constructor(public payload: VirtualMachine) {}
}

export class AttachIso implements Action {
  readonly type = ATTACH_ISO;

  constructor(
    public payload: {
      id: string;
      virtualMachineId: string;
    },
  ) {}
}

export class DetachIso implements Action {
  readonly type = DETACH_ISO;

  constructor(
    public payload: {
      virtualMachineId: string;
    },
  ) {}
}

export class StopVm implements Action {
  readonly type = STOP_VM;

  constructor(public payload: VirtualMachine) {}
}

export class StartVm implements Action {
  readonly type = START_VM;

  constructor(public payload: VirtualMachine) {}
}

export class RestoreVm implements Action {
  readonly type = RESTORE_VM;

  constructor(public payload: VirtualMachine) {}
}

export class ResetPasswordVm implements Action {
  readonly type = RESET_PASSWORD_VM;

  constructor(public payload: VirtualMachine) {}
}

export class RebootVm implements Action {
  readonly type = REBOOT_VM;

  constructor(public payload: VirtualMachine) {}
}

export class DestroyVm implements Action {
  readonly type = DESTROY_VM;

  constructor(public payload: VirtualMachine) {}
}

export class RecoverVm implements Action {
  readonly type = RECOVER_VM;

  constructor(public payload: VirtualMachine) {}
}

export class AccessVm implements Action {
  readonly type = ACCESS_VM;

  constructor(public payload: VirtualMachine) {}
}

export class WebShellVm implements Action {
  readonly type = WEB_SHELL_VM;

  constructor(public payload: VirtualMachine) {}
}

export class PulseVm implements Action {
  readonly type = PULSE_VM;

  constructor(public payload: VirtualMachine) {}
}

export class ConsoleVm implements Action {
  readonly type = CONSOLE_VM;

  constructor(public payload: VirtualMachine) {}
}

export class OpenUrlVm implements Action {
  readonly type = OPEN_URL_VM;

  constructor(public payload: VirtualMachine) {}
}

export class ViewVmLogs implements Action {
  readonly type = VIEW_VM_LOGS;

  constructor(public payload: VirtualMachine) {}
}

export class ExpungeVm implements Action {
  readonly type = EXPUNGE_VM;

  constructor(public payload: VirtualMachine) {}
}

export class ExpungeVmSuccess implements Action {
  readonly type = EXPUNGE_VM_SUCCESS;

  constructor(public payload: VirtualMachine) {}
}

export class DeploymentRequestSuccess implements Action {
  readonly type = VM_DEPLOYMENT_REQUEST_SUCCESS;

  constructor(public payload: VirtualMachine) {}
}

export class ChangeSshKey implements Action {
  readonly type = CHANGE_SSH_KEY;

  constructor(
    public payload: {
      vm: VirtualMachine;
      keyPair: SSHKeyPair;
    },
  ) {}
}

export class VMUpdateError implements Action {
  readonly type = VM_UPDATE_ERROR;

  constructor(
    public payload: {
      vm?: VirtualMachine;
      state?: VmState;
      error: Error;
    },
  ) {}
}

export class VmFormUpdate implements Action {
  type = VM_FORM_UPDATE;

  constructor(public payload?: Partial<VmCreationState>) {}
}

export class VmFormAdjust implements Action {
  type = VM_FORM_ADJUST;

  constructor(public payload?: Partial<VmCreationState>) {}
}

export class VmCreationStateUpdate implements Action {
  type = VM_CREATION_STATE_UPDATE;

  constructor(public payload: Partial<FormState>) {}
}

export class VmCreationEnoughResourceUpdateState implements Action {
  type = VM_CREATION_ENOUGH_RESOURCE_STATE_UPDATE;

  constructor(public payload: boolean) {}
}

export class VmInitialZoneSelect implements Action {
  type = VM_INITIAL_ZONE_SELECT;

  constructor(public payload?: boolean) {}
}

export class VmInitialSecurityGroupsSelect implements Action {
  type = VM_SECURITY_GROUPS_SELECT;

  constructor(public payload?: boolean) {}
}

export class DeployVm implements Action {
  type = DEPLOY_VM;

  constructor(public payload: VmCreationState) {}
}

export class VmCreationFormInit implements Action {
  type = VM_FORM_INIT;

  constructor(public payload?: any) {}
}

export class VmCreationFormClean implements Action {
  type = VM_FORM_CLEAN;

  constructor(public payload?: any) {}
}

export class DeploymentAddLoggerMessage implements Action {
  type = VM_DEPLOYMENT_ADD_LOGGER_MESSAGE;

  constructor(public payload?: ProgressLoggerMessageData) {}
}

export class DeploymentChangeStatus implements Action {
  type = VM_DEPLOYMENT_CHANGE_STATUS;

  constructor(public payload?: VmDeploymentMessage) {}
}

export class DeploymentUpdateLoggerMessage implements Action {
  type = VM_DEPLOYMENT_UPDATE_LOGGER_MESSAGE;

  constructor(
    public payload: {
      messageText: string | ParametrizedTranslation;
      data: Partial<ProgressLoggerMessageData>;
    },
  ) {}
}

export class DeploymentInitActionList implements Action {
  type = VM_DEPLOYMENT_INIT_ACTION_LIST;

  constructor(public payload: ProgressLoggerMessageData[]) {}
}

export class DeploymentRequest implements Action {
  type = VM_DEPLOYMENT_REQUEST;

  constructor(public payload: VmCreationState) {}
}

export class DeploymentRequestError implements Action {
  type = VM_DEPLOYMENT_REQUEST_ERROR;

  constructor(public payload: any) {}
}

export class VmDeploymentCopyTags implements Action {
  type = VM_DEPLOYMENT_COPY_TAGS;

  constructor(public payload: Tag[]) {}
}

export class SaveVMPassword implements Action {
  readonly type = SAVE_VM_PASSWORD;

  constructor(public payload: { vm: VirtualMachine; password: string }) {}
}

export class SaveVMPasswordSuccess implements Action {
  readonly type = SAVE_VM_PASSWORD_SUCCESS;

  constructor(public payload: { vmId: string; password: string }) {}
}

export class SaveVMPasswordError implements Action {
  readonly type = SAVE_VM_PASSWORD_ERROR;

  constructor(public payload: { error: Error }) {}
}

export type Actions =
  | LoadVMsRequest
  | LoadVMsResponse
  | LoadVirtualMachine
  | VirtualMachineLoaded
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
  | RebootVm
  | DestroyVm
  | RecoverVm
  | ExpungeVm
  | ExpungeVmSuccess
  | ChangeSshKey
  | VMUpdateError
  | VmCreationStateUpdate
  | VmCreationEnoughResourceUpdateState
  | VmCreationFormInit
  | VmCreationFormClean
  | VmFormUpdate
  | VmFormAdjust
  | VmInitialZoneSelect
  | VmInitialSecurityGroupsSelect
  | DeployVm
  | DeploymentChangeStatus
  | DeploymentAddLoggerMessage
  | DeploymentUpdateLoggerMessage
  | DeploymentInitActionList
  | DeploymentRequest
  | DeploymentRequestSuccess
  | DeploymentRequestError
  | VmDeploymentCopyTags
  | SaveVMPassword
  | SaveVMPasswordSuccess
  | SaveVMPasswordError;
