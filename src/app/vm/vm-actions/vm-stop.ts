import { VmActions } from './vm-action';
import { VirtualMachine, VmStates } from '../shared/vm.model';
import { Injectable } from '@angular/core';
import { VirtualMachineCommand } from './vm-command';


@Injectable()
export class VmStopAction extends VirtualMachineCommand {
  public commandName = 'stop';
  public vmStateOnAction = 'STOP_IN_PROGRESS';

  public action = VmActions.STOP;
  public name = 'VM_PAGE.COMMANDS.STOP';
  public icon = 'stop';

  public tokens = {
    name: 'Stop',
    nameLower: 'stop',
    nameCaps: 'VM_PAGE.COMMANDS.STOP',
    vmActionCompleted: 'JOB_NOTIFICATIONS.VM.STOP_DONE',
    confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_STOP',
    progressMessage: 'JOB_NOTIFICATIONS.VM.STOP_IN_PROGRESS',
    successMessage: 'JOB_NOTIFICATIONS.VM.STOP_DONE',
    failMessage: 'JOB_NOTIFICATIONS.VM.STOP_FAILED'
  };

  public canActivate(vm: VirtualMachine): boolean {
    return vm.state === VmStates.Running;
  }
}
