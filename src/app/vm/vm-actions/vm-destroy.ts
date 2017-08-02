import { VirtualMachineAction, VmActions } from './vm-action';
import { VirtualMachine, VmStates } from '../shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { VmService } from '../shared/vm.service';
import { VmEntityDeletionService } from '../shared/vm-entity-deletion.service';
import { Volume } from '../../shared/models/volume.model';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { Injectable } from '@angular/core';


@Injectable()
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
    successMessage: 'DESTROY_DONE',
    failMessage: 'VM_DESTROY_FAILED'
  };

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    protected vmService: VmService,
    protected vmEntityDeletionService: VmEntityDeletionService
  ) {
    super(dialogService, jobsNotificationService, vmService);
  }

  public canActivate(vm: VirtualMachine): boolean {
    return [
      VmStates.Running,
      VmStates.Stopped,
      VmStates.Error
    ]
      .includes(vm.state);
  }

  public activate(vm: VirtualMachine): Observable<any> {
    return this.showConfirmationDialog()
      .switchMap(() => this.onDeleteConfirm(vm))
      .catch(() => this.onDeleteDecline());
  }

  private onDeleteConfirm(vm: VirtualMachine): Observable<any> {
    return this.volumeDeleteConfirmDialog(vm.volumes)
      .switchMap(_ => this.addNotifications(this.deleteVmWithVolumes(vm)))
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

    return this.dialogService.confirm(
      'CONFIRM_VM_DELETE_DRIVES',
      'NO',
      'YES'
    );
  }
}
