import { Injectable } from '@angular/core';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { AuthService } from '../../shared/services/auth.service';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { VirtualMachine, VmState } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';
import { VmActions } from './vm-action';
import { VirtualMachineCommand } from './vm-command';


@Injectable()
export class VmExpungeAction extends VirtualMachineCommand {
  public commandName = 'expunge';
  public vmStateOnAction = 'VM_STATE.EXPUNGE_IN_PROGRESS';

  public action = VmActions.EXPUNGE;
  public name = 'VM_PAGE.COMMANDS.EXPUNGE';
  public icon = 'delete_forever';

  public tokens = {
    name: 'expunge',
    nameLower: 'expunge',
    nameCaps: 'VM_PAGE.COMMANDS.EXPUNGE',
    vmActionCompleted: 'JOB_NOTIFICATIONS.VM.EXPUNGE_DONE',
    confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_EXPUNGE',
    progressMessage: 'JOB_NOTIFICATIONS.VM.EXPUNGE_IN_PROGRESS',
    successMessage: 'JOB_NOTIFICATIONS.VM.EXPUNGE_DONE',
    failMessage: 'JOB_NOTIFICATIONS.VM.EXPUNGE_FAILED'
  };

  constructor(
    private auth: AuthService,
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    protected vmService: VmService,
  ) {
    super(dialogService, jobsNotificationService, vmService);
  }

  public canActivate(vm: VirtualMachine): boolean {
    if (!vm) {
      return false;
    }

    return vm.state === VmState.Destroyed && this.auth.canExpungeOrRecoverVm();
  }
}
