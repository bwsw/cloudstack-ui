import { VirtualMachineAction, VmActions } from './vm-action';
import { VirtualMachine, VmStates } from '../shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { VmService } from '../shared/vm.service';
import { VmActionsService } from '../shared/vm-actions.service';


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
    successMessage: 'RESETPASSWORDFOR_DONE'
  };

  constructor(
    protected dialogService: DialogService,
    protected vmService: VmService,
    protected vmActionsService: VmActionsService
  ) {
    super(dialogService, vmService);
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

  public activate(vm: VirtualMachine): Observable<void> {
    return this.showConfirmDialog()
      .switchMap(() => {
        if (vm.state === VmStates.Stopped) {
          return this.resetPasswordForStoppedVirtualMachine(vm);
        }

        return this.resetPasswordForRunningVirtualMachine(vm);
      });
  }

  private resetPasswordForStoppedVirtualMachine(vm: VirtualMachine): Observable<void> {
    return this.vmService.command(vm, this)
      .map(vmWithPassword => {
        if (vmWithPassword && vmWithPassword.password) {
          this.showPasswordDialog(vmWithPassword.displayName, vmWithPassword.password);
        }
      })
      .catch(error => this.dialogService.alert(error.message));
  }

  private resetPasswordForRunningVirtualMachine(vm: VirtualMachine): Observable<void> {
    const stop = this.vmActionsService.getStopActionSilent();
    const start = this.vmActionsService.getStartActionSilent();

    return this.vmService.command(vm, stop)
      .switchMap(() => this.resetPasswordForStoppedVirtualMachine(vm))
      .switchMap(() => this.vmService.command(vm, start))
      .catch(error => this.dialogService.alert(error.message));
  }

  private showConfirmDialog(): Observable<void> {
    return this.dialogService.customConfirm({
      message: this.tokens.confirmMessage,
      width: '400px'
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
}
