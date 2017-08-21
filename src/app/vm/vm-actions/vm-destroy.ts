import { VmActions } from './vm-action';
import { VirtualMachine, VmState } from '../shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { DialogsService } from '../../dialog/dialog-service/dialog.service';
import { VmService } from '../shared/vm.service';
import { VmEntityDeletionService } from '../shared/vm-entity-deletion.service';
import { Volume } from '../../shared/models/volume.model';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { Injectable } from '@angular/core';
import { VirtualMachineCommand } from './vm-command';


@Injectable()
export class VmDestroyAction extends VirtualMachineCommand {
  public commandName = 'destroy';
  public vmStateOnAction = 'DESTROY_IN_PROGRESS';

  public action = VmActions.DESTROY;
  public name = 'DESTROY';
  public icon = 'delete';

  public tokens = {
    name: 'Destroy',

    nameLower: 'destroy',
    nameCaps: 'DESTROY',
    vmActionCompleted: 'DESTROY_DONE',
    confirmMessage: 'CONFIRM_VM_DESTROY',
    progressMessage: 'VM_DESTROY_IN_PROGRESS',
    successMessage: 'DESTROY_DONE',
    failMessage: 'VM_DESTROY_FAILED'
  };

  constructor(
    protected dialogsService: DialogsService,
    protected jobsNotificationService: JobsNotificationService,
    protected vmService: VmService,
    protected vmEntityDeletionService: VmEntityDeletionService
  ) {
    super(dialogsService, jobsNotificationService, vmService);
  }

  public canActivate(vm: VirtualMachine): boolean {
    return [
      VmState.Running,
      VmState.Stopped,
      VmState.Error
    ]
      .includes(vm.state);
  }

  public activate(vm: VirtualMachine): Observable<any> {
    return this.showConfirmationDialog()
      .switchMap((res) => res ? this.onDeleteConfirm(vm) : this.onDeleteDecline());
  }

  private onDeleteConfirm(vm: VirtualMachine): Observable<any> {
    return this.volumeDeleteConfirmDialog(vm.volumes)
      .switchMap((res) => {
        if (res) {
          return this.addNotifications(this.deleteVmWithVolumes(vm));
        }
      })
      .catch(() => this.addNotifications(this.deleteVm(vm)));
  }

  private onDeleteDecline(): Observable<any> {
    return Observable.of(null);
  }

  private deleteVmWithVolumes(vm: VirtualMachine): Observable<any> {
    this.vmEntityDeletionService.markVolumesForDeletion(vm);
    return this.deleteVm(vm);
  }

  private deleteVm(vm: VirtualMachine): Observable<any> {
    return this.vmService.command(vm, this)
      .map(() => this.vmEntityDeletionService.markSecurityGroupsForDeletion(vm));
  }

  private volumeDeleteConfirmDialog(volumes: Array<Volume>): Observable<any> {
    if (volumes.length === 1) {
      return Observable.of(false);
    }

    return this.dialogsService.confirm({ message: 'CONFIRM_VM_DELETE_DRIVES'});
  }
}
