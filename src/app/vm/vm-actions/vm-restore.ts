import { VirtualMachineAction, VmActions } from './vm-action';
import { VirtualMachine, VmStates } from '../shared/vm.model';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { VmService } from '../shared/vm.service';


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
    successMessage: 'RESTORE_DONE'
  };

  constructor(
    public vm: VirtualMachine,
    protected dialogService: DialogService,
    protected vmService: VmService
  ) {
    super(vm, dialogService, vmService);
  }

  public canActivate(): boolean {
    return [
      VmStates.Running,
      VmStates.Stopped
    ]
      .includes(this.vm.state);
  }
}
