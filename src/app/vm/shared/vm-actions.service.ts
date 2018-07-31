import { VmActions } from '../vm-actions/vm-action';
import { VirtualMachine, VmState } from './vm.model';

const isIpAvailable = (vm) => {
  return vm.nic.length && !!vm.nic[0].ipaddress;
};

const VmStartAction = {
  name: 'VM_PAGE.COMMANDS.START',
  command: VmActions.START,
  icon: 'mdi-play',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_START',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Stopped
};

const VmStopAction = {
  name: 'VM_PAGE.COMMANDS.STOP',
  command: VmActions.STOP,
  icon: 'mdi-stop',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_STOP',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Running
};

const VmRebootAction = {
  name: 'VM_PAGE.COMMANDS.REBOOT',
  command: VmActions.REBOOT,
  icon: 'mdi-replay',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_REBOOT',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Running
};

const VmRestoreAction = {
  name: 'VM_PAGE.COMMANDS.RESTORE',
  command: VmActions.RESTORE,
  icon: 'mdi-backup-restore',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_RESTORE',
  canActivate: (vm: VirtualMachine) => !!vm && [
    VmState.Running,
    VmState.Stopped
  ].indexOf(vm.state) !== -1
};

const VmDestroyAction = {
  name: 'VM_PAGE.COMMANDS.DESTROY',
  command: VmActions.DESTROY,
  icon: 'mdi-delete',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_DESTROY',
  canActivate: (vm: VirtualMachine) => !!vm && [
    VmState.Running, VmState.Stopped,
    VmState.Error
  ].indexOf(vm.state) !== -1
};

const VmResetPasswordAction = {
  name: 'VM_PAGE.COMMANDS.RESET_PASSWORD',
  command: VmActions.RESET_PASSWORD,
  icon: 'mdi-key',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_RESET_PASSWORD',
  canActivate: (vm: VirtualMachine) => !!vm
    && [VmState.Running, VmState.Stopped].indexOf(vm.state) !== -1
    && vm.passwordEnabled
    && isIpAvailable(vm)
};

const VmExpungeAction = {
  name: 'VM_PAGE.COMMANDS.EXPUNGE',
  command: VmActions.EXPUNGE,
  icon: 'mdi-delete-forever',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_EXPUNGE',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Destroyed
};

const VmRecoverAction = {
  name: 'VM_PAGE.COMMANDS.RECOVER',
  command: VmActions.RECOVER,
  icon: 'mdi-restore',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_RECOVER',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Destroyed
};

export const VmAccessAction = {
  name: 'VM_PAGE.COMMANDS.VM_ACCESS',
  command: VmActions.ACCESS,
  icon: 'mdi-laptop',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Running
};

export const VmPulseAction = {

  name: 'PULSE.PULSE',
  command: VmActions.PULSE,
  icon: 'mdi-chart-line-variant',
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
