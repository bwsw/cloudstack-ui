import {
  VirtualMachine,
  VmState
} from './vm.model';

const isIpAvailable = (vm) => {
  return vm.nic.length && !!vm.nic[0].ipAddress;
};

const VmStartAction = {
  name: 'VM_PAGE.COMMANDS.START',
  command: 'start',
  icon: 'play_arrow',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_START',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Stopped
};

const VmStopAction = {
  name: 'VM_PAGE.COMMANDS.STOP',
  command: 'stop',
  icon: 'stop',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_STOP',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Running
};

const VmRebootAction = {
  name: 'VM_PAGE.COMMANDS.REBOOT',
  command: 'reboot',
  icon: 'replay',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_REBOOT',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Running
};

const VmRestoreAction = {
  name: 'VM_PAGE.COMMANDS.RESTORE',
  command: 'restore',
  icon: 'settings_backup_restore',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_RESTORE',
  canActivate: (vm: VirtualMachine) => !!vm && [ VmState.Running, VmState.Stopped ].includes(vm.state)
};

const VmDestroyAction = {
  name: 'VM_PAGE.COMMANDS.DESTROY',
  command: 'delete',
  icon: 'delete',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_DESTROY',
  canActivate: (vm: VirtualMachine) => !!vm && [ VmState.Running, VmState.Stopped, VmState.Error ].includes(vm.state)
};

const VmResetPasswordAction = {
  name: 'VM_PAGE.COMMANDS.RESET_PASSWORD',
  command: 'resetPasswordFor',
  icon: 'vpn_key',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_RESET_PASSWORD',
  canActivate: (vm: VirtualMachine) => !!vm
    && [ VmState.Running, VmState.Stopped ].includes(vm.state)
    && vm.passwordEnabled
    && isIpAvailable(vm)
};

const VmExpungeAction = {
  name: 'VM_PAGE.COMMANDS.EXPUNGE',
  command: 'expunge',
  icon: 'delete_forever',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_EXPUNGE',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Destroyed
};

const VmRecoverAction = {
  name: 'VM_PAGE.COMMANDS.RECOVER',
  command: 'recover',
  icon: 'restore',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_RECOVER',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Destroyed
};

export class VmActionsService {
  public actions = [
    VmStartAction,
    VmStopAction,
    VmRebootAction,
    VmRestoreAction,
    VmDestroyAction,
    VmResetPasswordAction
  ];
  public destroyedActions = [
    VmExpungeAction,
    VmRecoverAction
  ]
}
