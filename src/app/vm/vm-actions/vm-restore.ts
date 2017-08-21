import { VmActions } from './vm-action';
import { VirtualMachine, VmState } from '../shared/vm.model';
import { Injectable } from '@angular/core';
import { VirtualMachineCommand } from './vm-command';


@Injectable()
export class VmRestoreAction extends VirtualMachineCommand {
  public commandName = 'restore';
  public vmStateOnAction = 'RESTORE_IN_PROGRESS';

  public action = VmActions.RESTORE;
  public name = 'RESTORE';
  public icon = 'settings_backup_restore';

  public tokens = {
    name: 'Restore',
    nameLower: 'restore',
    nameCaps: 'RESTORE',
    vmActionCompleted: 'RESTORE_DONE',
    confirmMessage: 'CONFIRM_VM_RESTORE',
    progressMessage: 'VM_RESTORE_IN_PROGRESS',
    successMessage: 'RESTORE_DONE',
    failMessage: 'VM_RESTORE_FAILED'
  };

  public canActivate(vm: VirtualMachine): boolean {
    return [
      VmState.Running,
      VmState.Stopped
    ]
      .includes(vm.state);
  }
}
