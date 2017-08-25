import { VmActions } from './vm-action';
import { VirtualMachine, VmState } from '../shared/vm.model';
import { Injectable } from '@angular/core';
import { VirtualMachineCommand } from './vm-command';


@Injectable()
export class VmRebootAction extends VirtualMachineCommand {
  public commandName = 'reboot';
  public vmStateOnAction = 'VM_STATE.REBOOT_IN_PROGRESS';

  public action = VmActions.REBOOT;
  public name = 'VM_PAGE.COMMANDS.REBOOT';
  public icon = 'replay';

  public tokens = {
    name: 'Reboot',
    nameLower: 'reboot',
    nameCaps: 'VM_PAGE.COMMANDS.REBOOT',
    vmActionCompleted: 'JOB_NOTIFICATIONS.VM.REBOOT_DONE',
    confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_REBOOT',
    progressMessage: 'JOB_NOTIFICATIONS.VM.REBOOT_IN_PROGRESS',
    successMessage: 'JOB_NOTIFICATIONS.VM.REBOOT_DONE',
    failMessage: 'JOB_NOTIFICATIONS.VM.REBOOT_FAILED'
  };

  public canActivate(vm: VirtualMachine): boolean {
    if (!vm) {
      return false;
    }

    return vm.state === VmState.Running;
  }
}
