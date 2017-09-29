import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { AuthService } from '../../shared/services/auth.service';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { VirtualMachine, VmState } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';
import { VmActions } from './vm-action';
import { VirtualMachineCommand } from './vm-command';


@Injectable()
export class VmRecoverAction extends VirtualMachineCommand {
  public commandName = 'recover';
  public vmStateOnAction = 'VM_STATE.RECOVER_IN_PROGRESS';

  public action = VmActions.RECOVER;
  public name = 'VM_PAGE.COMMANDS.RECOVER';
  public icon = 'restore';

  public tokens = {
    name: 'recover',
    nameLower: 'recover',
    nameCaps: 'VM_PAGE.COMMANDS.RECOVER',
    vmActionCompleted: 'JOB_NOTIFICATIONS.VM.RECOVER_DONE',
    confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_RECOVER',
    progressMessage: 'JOB_NOTIFICATIONS.VM.RECOVER_IN_PROGRESS',
    successMessage: 'JOB_NOTIFICATIONS.VM.RECOVER_DONE',
    failMessage: 'JOB_NOTIFICATIONS.VM.RECOVER_FAILED'
  };

  constructor(
    private auth: AuthService,
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    protected vmService: VmService,
  ) {
    super(dialogService, jobsNotificationService, vmService);
  }

  protected onActionConfirmed(vm: VirtualMachine): Observable<any> {
    return this.addNotifications(this.vmService.commandSync(vm, this));
  }

  public canActivate(vm: VirtualMachine): boolean {
    if (!vm) {
      return false;
    }

    return vm.state === VmState.Destroyed && this.auth.canExpungeOrRecoverVm();
  }
}
