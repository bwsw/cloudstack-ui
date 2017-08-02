import { VirtualMachineAction, VmActions } from './vm-action';
import { VirtualMachine, VmStates } from '../shared/vm.model';
import { Injectable } from '@angular/core';


@Injectable()
export class VmRestoreAction extends VirtualMachineAction {
  public action = VmActions.RESTORE;
  public name = 'RESTORE';
  public icon = 'settings_backup_restore';

  public tokens = {
    name: 'Restore',
    commandName: 'restore',
    nameLower: 'restore',
    nameCaps: 'RESTORE',
    vmStateOnAction: 'RESTORE_IN_PROGRESS',
    vmActionCompleted: 'RESTORE_DONE',
    confirmMessage: 'CONFIRM_VM_RESTORE',
    progressMessage: 'VM_RESTORE_IN_PROGRESS',
    successMessage: 'RESTORE_DONE',
    failMessage: 'VM_RESTORE_FAILED'
  };

  public canActivate(vm: VirtualMachine): boolean {
    return [
      VmStates.Running,
      VmStates.Stopped
    ]
      .includes(vm.state);
  }
}
