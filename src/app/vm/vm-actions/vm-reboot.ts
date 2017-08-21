import { VmActions } from './vm-action';
import { VirtualMachine, VmState } from '../shared/vm.model';
import { Injectable } from '@angular/core';
import { VirtualMachineCommand } from './vm-command';


@Injectable()
export class VmRebootAction extends VirtualMachineCommand {
  public commandName = 'reboot';
  public vmStateOnAction = 'REBOOT_IN_PROGRESS';

  public action = VmActions.REBOOT;
  public name = 'REBOOT';
  public icon = 'replay';

  public tokens = {
    name: 'Reboot',
    nameLower: 'reboot',
    nameCaps: 'REBOOT',
    vmActionCompleted: 'REBOOT_DONE',
    confirmMessage: 'CONFIRM_VM_REBOOT',
    progressMessage: 'VM_REBOOT_IN_PROGRESS',
    successMessage: 'REBOOT_DONE',
    failMessage: 'VM_REBOOT_FAILED'
  };

  public canActivate(vm: VirtualMachine): boolean {
    if (!vm) {
      return false;
    }

    return vm.state === VmState.Running;
  }
}
