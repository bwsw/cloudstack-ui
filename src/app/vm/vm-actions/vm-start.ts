import { VmActions } from './vm-action';
import { VirtualMachine, VmStates } from '../shared/vm.model';
import { Injectable } from '@angular/core';
import { VirtualMachineCommand } from './vm-command';


@Injectable()
export class VmStartAction extends VirtualMachineCommand {
  public commandName = 'start';
  public vmStateOnAction = 'VM_STATE.START_IN_PROGRESS';

  public action = VmActions.START;
  public name = 'VM_PAGE.COMMANDS.START';
  public icon = 'play_arrow';

  public tokens = {
    name: 'Start',
    nameLower: 'start',
    nameCaps: 'VM_PAGE.COMMANDS.START',
    vmActionCompleted: 'JOB_NOTIFICATIONS.VM.START_DONE',
    confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_START',
    progressMessage: 'JOB_NOTIFICATIONS.VM.START_IN_PROGRESS',
    successMessage: 'JOB_NOTIFICATIONS.VM.START_DONE',
    failMessage: 'JOB_NOTIFICATIONS.VM.START_FAILED'
  };

  public canActivate(vm: VirtualMachine): boolean {
    return vm.state === VmStates.Stopped;
  }
}
