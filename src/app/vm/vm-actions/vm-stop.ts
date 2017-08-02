import { VirtualMachineAction, VmActions } from './vm-action';
import { VirtualMachine, VmStates } from '../shared/vm.model';
import { Injectable } from '@angular/core';


@Injectable()
export class VmStopAction extends VirtualMachineAction {
  public action = VmActions.STOP;
  public name = 'STOP';
  public icon = 'stop';

  public tokens = {
    name: 'Stop',
    commandName: 'stop',
    nameLower: 'stop',
    nameCaps: 'STOP',
    vmStateOnAction: 'STOP_IN_PROGRESS',
    vmActionCompleted: 'STOP_DONE',
    confirmMessage: 'CONFIRM_VM_STOP',
    progressMessage: 'VM_STOP_IN_PROGRESS',
    successMessage: 'STOP_DONE',
    failMessage: 'VM_STOP_FAILED'
  };

  public canActivate(vm: VirtualMachine): boolean {
    return vm.state === VmStates.Running;
  }
}
