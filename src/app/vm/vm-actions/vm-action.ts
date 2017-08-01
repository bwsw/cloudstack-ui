import { VirtualMachine } from '../shared/vm.model';
import { Action } from '../../shared/interfaces/action.interface';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { VmService } from '../shared/vm.service';
import { Observable } from 'rxjs/Observable';


export type VirtualMachineActionType =
    'start'
  | 'stop'
  | 'reboot'
  | 'restore'
  | 'destroy'
  | 'resetPasswordFor'
  | 'console'
  | 'webShell'
  | 'changeServiceOffering';

export const VmActions = {
  START: 'start' as VirtualMachineActionType,
  STOP: 'stop' as VirtualMachineActionType,
  REBOOT: 'reboot' as VirtualMachineActionType,
  RESTORE: 'restore' as VirtualMachineActionType,
  DESTROY: 'destroy' as VirtualMachineActionType,
  RESET_PASSWORD: 'resetPasswordFor' as VirtualMachineActionType,
  CONSOLE: 'console' as VirtualMachineActionType,
  WEB_SHELL: 'webShell' as VirtualMachineActionType,
  CHANGE_SERVICE_OFFERING: 'changeServiceOfering' as VirtualMachineActionType
};

export abstract class VirtualMachineAction implements Action<VirtualMachine> {
  public name: string;
  public action: VirtualMachineActionType;
  public icon?: string;
  public tokens?: { [key: string]: string; };

  constructor(
    public vm: VirtualMachine,
    protected dialogService: DialogService,
    protected vmService: VmService
  ) {}

  public activate(): Observable<any> {
    const dialog = this.dialogService.confirm(
      this.tokens.confirmMessage,
      'NO',
      'YES'
    );

    return this.handleAction(dialog);
  }

  protected handleAction(dialog: any): Observable<void> {
    return dialog
      .onErrorResumeNext()
      .switchMap(() => this.vmService.command(this))
      .catch(error => this.dialogService.alert(error.message));
  }
}
