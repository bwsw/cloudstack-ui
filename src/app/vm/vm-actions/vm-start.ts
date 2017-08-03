import { VmActions } from './vm-action';
import { VirtualMachine, VmStates } from '../shared/vm.model';
import { Injectable } from '@angular/core';
import { VirtualMachineCommand } from './vm-command';


@Injectable()
export class VmStartAction extends VirtualMachineCommand {
  public commandName = 'start';
  public vmStateOnAction = 'START_IN_PROGRESS';

  public action = VmActions.START;
  public name = 'START';
  public icon = 'play_arrow';

  public tokens = {
    name: 'Start',
    nameLower: 'start',
    nameCaps: 'START',
    vmActionCompleted: 'START_DONE',
    confirmMessage: 'CONFIRM_VM_START',
    progressMessage: 'VM_START_IN_PROGRESS',
    successMessage: 'START_DONE',
    failMessage: 'VM_START_FAILED'
  };

  public canActivate(vm: VirtualMachine): boolean {
    return vm.state === VmStates.Stopped;
  }
}
