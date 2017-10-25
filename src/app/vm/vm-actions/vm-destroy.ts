import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Volume } from '../../shared/models/volume.model';
import { AuthService } from '../../shared/services/auth.service';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { VmEntityDeletionService } from '../shared/vm-entity-deletion.service';
import { VirtualMachine, VmState } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';
import { VmActions } from './vm-action';
import { VirtualMachineCommand } from './vm-command';
import { VmDestroyDialogComponent } from '../shared/vm-destroy-dialog/vm-destroy-dialog.component';


@Injectable()
export class VmDestroyAction extends VirtualMachineCommand {
  public commandName = 'destroy';
  public vmStateOnAction = 'VM_STATE.DESTROY_IN_PROGRESS';

  public action = VmActions.DESTROY;
  public name = 'VM_PAGE.COMMANDS.DESTROY';
  public icon = 'delete';

  public tokens = {
    name: 'Destroy',

    nameLower: 'destroy',
    nameCaps: 'VM_PAGE.COMMANDS.DESTROY',
    vmActionCompleted: 'JOB_NOTIFICATIONS.VM.DESTROY_DONE',
    confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_DESTROY',
    progressMessage: 'JOB_NOTIFICATIONS.VM.DESTROY_IN_PROGRESS',
    successMessage: 'JOB_NOTIFICATIONS.VM.DESTROY_DONE',
    failMessage: 'JOB_NOTIFICATIONS.VM.DESTROY_FAILED'
  };

  constructor(
    private auth: AuthService,
    private dialog: MatDialog,
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    protected vmService: VmService,
    protected vmEntityDeletionService: VmEntityDeletionService
  ) {
    super(dialogService, jobsNotificationService, vmService);
  }

  public canActivate(vm: VirtualMachine): boolean {
    if (!vm) {
      return false;
    }

    return [
      VmState.Running,
      VmState.Stopped,
      VmState.Error
    ]
      .includes(vm.state);
  }

  public activate(vm: VirtualMachine): Observable<any> {
    return this.dialog.open(VmDestroyDialogComponent, {
      data: this.auth.canExpungeOrRecoverVm()
    })
      .afterClosed()
      .switchMap((res) => {
        return res ? this.onDeleteConfirm(vm, res) : this.onDeleteDecline()
      });
  }

  private onDeleteConfirm(vm: VirtualMachine, params?: {}): Observable<any> {
    return this.volumeDeleteConfirmDialog(vm.volumes)
      .switchMap((res) => {
        if (res) {
          return this.addNotifications(this.deleteVmWithVolumes(vm, params));
        }
      })
      .catch(() => this.addNotifications(this.deleteVm(vm, params)));
  }

  private onDeleteDecline(): Observable<any> {
    return Observable.of(null);
  }

  private deleteVmWithVolumes(vm: VirtualMachine, params?: {}): Observable<any> {
    return Observable.forkJoin(
      this.vmEntityDeletionService.markVolumesForDeletion(vm),
      this.deleteVm(vm, params)
    );
  }

  private deleteVm(vm: VirtualMachine, params?: {}): Observable<any> {
    return this.vmService.command(vm, this, params)
      .switchMap(() => this.vmEntityDeletionService.markSecurityGroupsForDeletion(vm));
  }

  private volumeDeleteConfirmDialog(volumes: Array<Volume>): Observable<any> {
    if (volumes.length === 1) {
      return Observable.of(false);
    }

    return this.dialogService.confirm({ message: 'DIALOG_MESSAGES.VM.CONFIRM_DRIVES_DELETION' });
  }
}
