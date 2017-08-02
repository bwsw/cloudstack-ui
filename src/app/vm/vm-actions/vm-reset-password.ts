import { VirtualMachineAction, VmActions } from './vm-action';
import { VirtualMachine, VmStates } from '../shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { VmService } from '../shared/vm.service';
import { VmActionsService } from '../shared/vm-actions.service';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { Injectable } from '@angular/core';
import { VmStartAction } from './vm-start';
import { VmStartActionSilent } from './silent/vm-start-silent';
import { VmStopActionSilent } from './silent/vm-stop-silent';


@Injectable()
export class VmResetPasswordAction extends VirtualMachineAction {
  public action = VmActions.RESET_PASSWORD;
  public name = 'RESETPASSWORDFOR';
  public icon = 'vpn_key';

  public tokens = {
    name: 'ResetPasswordFor',
    commandName: 'resetPasswordFor',
    nameLower: 'resetpasswordfor',
    nameCaps: 'RESETPASSWORDFOR',
    vmStateOnAction: 'RESETPASSWORDFOR_IN_PROGRESS',
    vmActionCompleted: 'RESETPASSWORDFOR_DONE',
    confirmMessage: 'CONFIRM_VM_RESETPASSWORDFOR',
    progressMessage: 'VM_RESETPASSWORDFOR_IN_PROGRESS',
    successMessage: 'RESETPASSWORDFOR_DONE',
    failMessage: 'VM_RESET_PASSWORD_FAILED'
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
    const ipAvailable = vm.ipIsAvailable;
    const stateIsOk = [
      VmStates.Running,
      VmStates.Stopped
    ]
      .includes(vm.state);

    return ipAvailable && stateIsOk;
  }

  protected onActionConfirmed(vm: VirtualMachine): Observable<any> {
    if (vm.state === VmStates.Stopped) {
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
        this.vmService.setStateForVm(vm, VmStates.Stopped);
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
    return this.dialogService.customAlert({
      message: {
        translationToken: 'PASSWORD_DIALOG_MESSAGE',
        interpolateParams: {
          vmName,
          vmPassword
        },
      },
      width: '400px',
      clickOutsideToClose: false
    });
  }

  protected showConfirmationDialog(): Observable<void> {
    return this.dialogService.customConfirm({
      message: this.tokens.confirmMessage,
      width: '400px'
    });
  }
}
