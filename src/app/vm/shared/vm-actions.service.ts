import { VmActions } from '../vm-actions/vm-action';
import { VirtualMachine, VmState } from './vm.model';

const isIpAvailable = vm => {
  return vm.nic.length && !!vm.nic[0].ipaddress;
};

const vmStartAction = {
  name: 'VM_PAGE.COMMANDS.START',
  command: VmActions.START,
  icon: 'mdi-play',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_START',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Stopped,
};

const vmStopAction = {
  name: 'VM_PAGE.COMMANDS.STOP',
  command: VmActions.STOP,
  icon: 'mdi-stop',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_STOP',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Running,
};

const vmRebootAction = {
  name: 'VM_PAGE.COMMANDS.REBOOT',
  command: VmActions.REBOOT,
  icon: 'mdi-replay',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_REBOOT',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Running,
};

const vmRestoreAction = {
  name: 'VM_PAGE.COMMANDS.RESTORE',
  command: VmActions.RESTORE,
  icon: 'mdi-backup-restore',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_RESTORE',
  canActivate: (vm: VirtualMachine) =>
    !!vm && [VmState.Running, VmState.Stopped].indexOf(vm.state) !== -1,
};

const vmDestroyAction = {
  name: 'VM_PAGE.COMMANDS.DESTROY',
  command: VmActions.DESTROY,
  icon: 'mdi-delete',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_DESTROY',
  canActivate: (vm: VirtualMachine) =>
    !!vm && [VmState.Running, VmState.Stopped, VmState.Error].indexOf(vm.state) !== -1,
};

const vmResetPasswordAction = {
  name: 'VM_PAGE.COMMANDS.RESET_PASSWORD',
  command: VmActions.RESET_PASSWORD,
  icon: 'mdi-key',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_RESET_PASSWORD',
  canActivate: (vm: VirtualMachine) =>
    !!vm &&
    [VmState.Running, VmState.Stopped].indexOf(vm.state) !== -1 &&
    vm.passwordenabled &&
    isIpAvailable(vm),
};

const vmExpungeAction = {
  name: 'VM_PAGE.COMMANDS.EXPUNGE',
  command: VmActions.EXPUNGE,
  icon: 'mdi-delete-forever',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_EXPUNGE',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Destroyed,
};

const vmRecoverAction = {
  name: 'VM_PAGE.COMMANDS.RECOVER',
  command: VmActions.RECOVER,
  icon: 'mdi-restore-clock',
  confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_RECOVER',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Destroyed,
};

export const vmAccessAction = {
  name: 'VM_PAGE.COMMANDS.VM_ACCESS',
  command: VmActions.ACCESS,
  icon: 'mdi-laptop',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Running,
};

export const vmPulseAction = {
  name: 'PULSE.PULSE',
  command: VmActions.PULSE,
  icon: 'mdi-chart-line-variant',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Running,
};

export const vmLogsAction = {
  name: 'VM_PAGE.COMMANDS.LOGS',
  command: VmActions.LOGS,
  icon: 'mdi-text',
  canActivate: () => true,
};

export class VmActionsService {
  public actions = [
    vmStartAction,
    vmStopAction,
    vmRebootAction,
    vmRestoreAction,
    vmDestroyAction,
    vmResetPasswordAction,
    vmAccessAction,
    vmPulseAction,
    vmLogsAction,
  ];
  public destroyedActions = [vmExpungeAction, vmRecoverAction];
}
