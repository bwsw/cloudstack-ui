import { VirtualMachineAction, VmActions } from './vm-action';
import { VirtualMachine, VmStates } from '../shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { VmService } from '../shared/vm.service';
import { VmEntityDeletionService } from '../shared/vm-entity-deletion.service';


export class VmDestroyAction extends VirtualMachineAction {
  public action = VmActions.DESTROY;
  public name = 'DESTROY';
  public icon = 'delete';

  public tokens = {
    name: 'Destroy',
    commandName: 'destroy',
    nameLower: 'destroy',
    nameCaps: 'DESTROY',
    vmStateOnAction: 'DESTROY_IN_PROGRESS',
    vmActionCompleted: 'DESTROY_DONE',
    confirmMessage: 'CONFIRM_VM_DESTROY',
    progressMessage: 'VM_DESTROY_IN_PROGRESS',
    successMessage: 'DESTROY_DONE'
  };

  constructor(
    public vm: VirtualMachine,
    protected dialogService: DialogService,
    protected vmService: VmService,
    protected vmEntityDeletionService: VmEntityDeletionService
  ) {
    super(vm, dialogService, vmService);
  }

  public canActivate(): boolean {
    return [
      VmStates.Running,
      VmStates.Stopped,
      VmStates.Error
    ]
      .includes(this.vm.state);
  }

  public activate(): Observable<void> {
    const dialog = this.dialogService.confirm(
      this.tokens.confirmMessage,
      'NO',
      'YES'
    );

    return dialog
      .switchMap(() => this.volumeDeleteConfirmDialog())
      .switchMap(() => this.vmService.command(this))
      .map(() => this.vmEntityDeletionService.markVmEntitiesForDeletion(this.vm))
      .catch(() => this.vmService.command(this));
  }

  private volumeDeleteConfirmDialog(): any {
    if (this.vm.volumes.length === 1) {
      return Observable.of(false);
    }

    return this.dialogService.confirm(
      'CONFIRM_VM_DELETE_DRIVES',
      'NO',
      'YES'
    );
  }
}
