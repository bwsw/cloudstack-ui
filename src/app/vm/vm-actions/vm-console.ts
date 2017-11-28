import {
  VirtualMachine,
  VmState
} from '../shared/vm.model';

export const VmConsoleAction = {
  name: 'VM_PAGE.COMMANDS.CONSOLE',
  icon: 'computer',
  canActivate: (vm: VirtualMachine) => !!vm && vm.state === VmState.Running,
  activate: (vm: VirtualMachine) =>
    window.open(
      `client/console?cmd=access&vm=${vm.id}`,
      vm.displayName,
      'resizable=0,width=820,height=640'
    ),
  hidden: () => false
};
