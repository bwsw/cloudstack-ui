import { VmActions } from '../vm-actions/vm-action';
import {
  VirtualMachine,
  VmState
} from './vm.model';

const isIpAvailable = (vm) => {
  return vm.nic.length && !!vm.nic[0].ipAddress;
};

const VmStartAction = {
  name: 'VM_PAGE.COMMANDS.START',
  command: VmActions.START,
  icon: 'play_arrow',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_START',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Stopped
};

const VmStopAction = {
  name: 'VM_PAGE.COMMANDS.STOP',
  command: VmActions.STOP,
  icon: 'stop',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_STOP',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Running
};

const VmRebootAction = {
  name: 'VM_PAGE.COMMANDS.REBOOT',
  command: VmActions.REBOOT,
  icon: 'replay',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_REBOOT',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Running
};

const VmRestoreAction = {
  name: 'VM_PAGE.COMMANDS.RESTORE',
  command: VmActions.RESTORE,
  icon: 'settings_backup_restore',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_RESTORE',
  canActivate: (vm: VirtualMachine) => !!vm && [
    VmState.Running,
    VmState.Stopped
  ].includes(vm.state)
};

const VmDestroyAction = {
  name: 'VM_PAGE.COMMANDS.DESTROY',
  command: VmActions.DESTROY,
  icon: 'delete',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_DESTROY',
  canActivate: (vm: VirtualMachine) => !!vm && [
    VmState.Running, VmState.Stopped,
    VmState.Error
  ].includes(vm.state)
};

const VmResetPasswordAction = {
  name: 'VM_PAGE.COMMANDS.RESET_PASSWORD',
  command: VmActions.RESET_PASSWORD,
  icon: 'vpn_key',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_RESET_PASSWORD',
  canActivate: (vm: VirtualMachine) => !!vm
    && [VmState.Running, VmState.Stopped].includes(vm.state)
    && vm.passwordEnabled
    && isIpAvailable(vm)
};

const VmExpungeAction = {
  name: 'VM_PAGE.COMMANDS.EXPUNGE',
  command: VmActions.EXPUNGE,
  icon: 'delete_forever',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_EXPUNGE',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Destroyed
};

const VmRecoverAction = {
  name: 'VM_PAGE.COMMANDS.RECOVER',
  command: VmActions.RECOVER,
  icon: 'restore',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_RECOVER',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Destroyed
};

export const VmAccessAction = {
  name: 'VM_PAGE.COMMANDS.VM_ACCESS',
  command: VmActions.ACCESS,
  icon: 'computer',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Running
};

export const VmPulseAction = {

  name: 'PULSE.PULSE',
  command: VmActions.PULSE,
  icon: 'timeline',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Running
};

export class VmActionsService {
  public actions = [
    VmStartAction,
    VmStopAction,
    VmRebootAction,
    VmRestoreAction,
    VmDestroyAction,
    VmResetPasswordAction,
    VmAccessAction,
    VmPulseAction
  ];
  public destroyedActions = [
    VmExpungeAction,
    VmRecoverAction
  ];
}
