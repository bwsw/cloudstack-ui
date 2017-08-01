import { VirtualMachineAction, VmActions } from './vm-action';
import { VirtualMachine, VmStates } from '../shared/vm.model';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { VmService } from '../shared/vm.service';
import { VmActionBuilderService } from './vm-action-builder.service';


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
    public vm: VirtualMachine,
    protected dialogService: DialogService,
    protected vmService: VmService,
    protected vmActionBuilderService: VmActionBuilderService
  ) {
    super(vm, dialogService, vmService);
  }

  public canActivate(): boolean {
    const ipAvailable = this.vm.ipIsAvailable;
    const stateIsOk = [
      VmStates.Running,
      VmStates.Stopped
    ]
      .includes(this.vm.state);

    return ipAvailable && stateIsOk;
  }

  public activate(): Observable<void> {
    return this.showConfirmDialog()
      .switchMap(() => {
        if (this.vm.state === VmStates.Stopped) {
          return this.resetPasswordForStoppedVirtualMachine();
        }

        return this.resetPasswordForRunningVirtualMachine();
      });
  }

  private resetPasswordForStoppedVirtualMachine(): Observable<void> {
    return this.vmService.command(this)
      .map(vm => {
        if (vm && vm.password) {
          this.showPasswordDialog(vm.displayName, vm.password);
        }
      })
      .catch(error => this.dialogService.alert(error.message));
  }

  private resetPasswordForRunningVirtualMachine(): Observable<void> {
    const stop = this.vmActionBuilderService.getStopAction(this.vm);
    const start = this.vmActionBuilderService.getStartAction(this.vm);

    return this.vmService.command(stop)
      .switchMap(() => this.resetPasswordForStoppedVirtualMachine())
      .switchMap(() => this.vmService.command(start))
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
