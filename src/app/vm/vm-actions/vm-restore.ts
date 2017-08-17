import { VmActions } from './vm-action';
import { VirtualMachine, VmStates } from '../shared/vm.model';
import { Injectable } from '@angular/core';
import { VirtualMachineCommand } from './vm-command';


@Injectable()
export class VmRestoreAction extends VirtualMachineCommand {
  public commandName = 'restore';
  public vmStateOnAction = 'VM_STATE.RESTORE_IN_PROGRESS';

  public action = VmActions.RESTORE;
  public name = 'VM_PAGE.COMMANDS.RESTORE';
  public icon = 'settings_backup_restore';

  public tokens = {
    name: 'Restore',
    nameLower: 'restore',
    nameCaps: 'VM_PAGE.COMMANDS.RESTORE',
    vmActionCompleted: 'JOB_NOTIFICATIONS.VM.RESTORE_DONE',
    confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_RESTORE',
    progressMessage: 'JOB_NOTIFICATIONS.VM.RESTORE_IN_PROGRESS',
    successMessage: 'JOB_NOTIFICATIONS.VM.RESTORE_DONE',
    failMessage: 'JOB_NOTIFICATIONS.VM.RESTORE_FAILED'
  };

  public canActivate(vm: VirtualMachine): boolean {
    return [
      VmStates.Running,
      VmStates.Stopped
    ]
      .includes(vm.state);
  }
}
