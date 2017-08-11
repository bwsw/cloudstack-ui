import { VmActions } from './vm-action';
import { VirtualMachine, VmStates } from '../shared/vm.model';
import { Injectable } from '@angular/core';
import { VirtualMachineCommand } from './vm-command';


@Injectable()
export class VmStopAction extends VirtualMachineCommand {
  public commandName = 'stop';
  public vmStateOnAction = 'STOP_IN_PROGRESS';

  public action = VmActions.STOP;
  public name = 'STOP';
  public icon = 'stop';

  public tokens = {
    name: 'Stop',
    nameLower: 'stop',
    nameCaps: 'STOP',
    vmActionCompleted: 'STOP_DONE',
    confirmMessage: 'CONFIRM_VM_STOP',
    progressMessage: 'VM_STOP_IN_PROGRESS',
    successMessage: 'STOP_DONE',
    failMessage: 'VM_STOP_FAILED'
  };

  public canActivate(vm: VirtualMachine): boolean {
    if (!vm) {
      return false;
    }

    return vm.state === VmStates.Running;
  }
}
