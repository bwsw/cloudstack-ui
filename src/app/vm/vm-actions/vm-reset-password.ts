import { VmActions } from './vm-action';
import { VirtualMachine, VmState } from '../shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { VmService } from '../shared/vm.service';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { Injectable } from '@angular/core';
import { VmStartActionSilent } from './silent/vm-start-silent';
import { VmStopActionSilent } from './silent/vm-stop-silent';
import { VirtualMachineCommand } from './vm-command';


@Injectable()
export class VmResetPasswordAction extends VirtualMachineCommand {
  public commandName = 'resetPasswordFor';
  public vmStateOnAction = 'VM_STATE.RESET_PASSWORD_IN_PROGRESS';

  public action = VmActions.RESET_PASSWORD;
  public name = 'VM_PAGE.COMMANDS.RESET_PASSWORD';
  public icon = 'vpn_key';

  public tokens = {
    name: 'ResetPasswordFor',
    nameLower: 'resetpasswordfor',
    nameCaps: 'VM_PAGE.COMMANDS.RESET_PASSWORD',
    vmActionCompleted: 'JOB_NOTIFICATIONS.VM.RESET_PASSWORD_DONE',
    confirmMessage: 'DIALOG_MESSAGES.VM.CONFIRM_RESET_PASSWORD',
    progressMessage: 'JOB_NOTIFICATIONS.VM.RESET_PASSWORD_IN_PROGRESS',
    successMessage: 'JOB_NOTIFICATIONS.VM.RESET_PASSWORD_DONE',
    failMessage: 'JOB_NOTIFICATIONS.VM.RESET_PASSWORD_FAILED'
  };

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    protected vmService: VmService,
    protected vmStartActionSilent: VmStartActionSilent,
    protected vmStopActionSilent: VmStopActionSilent
  ) {
    super(dialogService, jobsNotificationService, vmService);
  }

  public canActivate(vm: VirtualMachine): boolean {
    if (!vm) {
      return false;
    }

    const passwordEnabled = vm.passwordEnabled;
    const ipAvailable = vm.ipIsAvailable;
    const stateIsOk = [
      VmState.Running,
      VmState.Stopped
    ]
      .includes(vm.state);

    return ipAvailable && stateIsOk && passwordEnabled;
  }

  protected onActionConfirmed(vm: VirtualMachine): Observable<any> {
    if (vm.state === VmState.Stopped) {
      return this.addNotifications(
        this.resetPasswordForStoppedVirtualMachine(vm)
      );
    } else {
      return this.addNotifications(
        this.resetPasswordForRunningVirtualMachine(vm)
      );
    }
  }

  private resetPasswordForStoppedVirtualMachine(vm: VirtualMachine): Observable<any> {
    return this.vmService.command(vm, this)
      .map(vmWithPassword => {
        if (vmWithPassword && vmWithPassword.password) {
          this.showPasswordDialog(vmWithPassword.displayName, vmWithPassword.password);
        }
      })
      .catch(error => {
        this.vmService.setStateForVm(vm, VmState.Stopped);
        return Observable.throw(error);
      });
  }

  private resetPasswordForRunningVirtualMachine(vm: VirtualMachine): Observable<any> {
    const stop = this.vmStopActionSilent;
    const start = this.vmStartActionSilent;

    return this.vmService.command(vm, stop)
      .switchMap(() => this.resetPasswordForStoppedVirtualMachine(vm))
      .switchMap(() => this.vmService.command(vm, start))
      .catch(error => {
        this.vmService.command(vm, start).subscribe();
        return Observable.throw(error);
      });
  }

  private showPasswordDialog(vmName: string, vmPassword: string): Observable<void> {
    return this.dialogService.alert({
      message: {
        translationToken: 'DIALOG_MESSAGES.VM.PASSWORD_DIALOG_MESSAGE',
        interpolateParams: {
          vmName,
          vmPassword
        },
      },
      disableClose: true,
      width: '400px'
    });
  }

  protected showConfirmationDialog(): Observable<void> {
    return this.dialogService.confirm({
      message: this.tokens.confirmMessage,
      disableClose: true,
      width: '400px'
    });
  }
}
