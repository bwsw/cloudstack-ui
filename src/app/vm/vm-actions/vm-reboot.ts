import { VirtualMachineAction, VmActions } from './vm-action';
import { VirtualMachine, VmStates } from '../shared/vm.model';


export class VmRebootAction extends VirtualMachineAction {
  public action = VmActions.REBOOT;
  public name = 'REBOOT';
  public icon = 'replay';

  public tokens = {
    name: 'Reboot',
    commandName: 'reboot',
    nameLower: 'reboot',
    nameCaps: 'REBOOT',
    vmStateOnAction: 'REBOOT_IN_PROGRESS',
    vmActionCompleted: 'STOP_DONE',
    confirmMessage: 'CONFIRM_VM_STOP',
    progressMessage: 'VM_STOP_IN_PROGRESS',
    successMessage: 'STOP_DONE'
  };

  public canActivate(vm: VirtualMachine): boolean {
    return vm.state === VmStates.Running;
  }
}
