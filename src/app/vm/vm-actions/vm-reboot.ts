import { VirtualMachineAction, VmActions } from './vm-action';
import { VirtualMachine, VmStates } from '../shared/vm.model';
import { Injectable } from '@angular/core';


@Injectable()
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
    vmActionCompleted: 'REBOOT_DONE',
    confirmMessage: 'CONFIRM_VM_REBOOT',
    progressMessage: 'VM_REBOOT_IN_PROGRESS',
    successMessage: 'REBOOT_DONE',
    failMessage: 'VM_REBOOT_FAILED'
  };

  public canActivate(vm: VirtualMachine): boolean {
    return vm.state === VmStates.Running;
  }
}
