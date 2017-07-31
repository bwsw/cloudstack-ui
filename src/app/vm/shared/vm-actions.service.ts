import { Injectable } from '@angular/core';
import { VirtualMachine, VmAction, VmActions } from './vm.model';
import { ActionsService } from '../../shared/interfaces/action-service.interface';
import { Action } from '../../shared/interfaces/action.interface';
import { BaseTemplateModel } from '../../template/shared/base-template.model';
import { WebShellService } from '../../web-shell/web-shell.service';
import { VmActionsCheckerService } from './vm-actions-checker.service';


export interface VirtualMachineAction extends Action<VirtualMachine> {
  action: VmAction,
  tokens?: {
    [key: string]: string;
  }
  activate(vm: VirtualMachine, template?: BaseTemplateModel): void;
}

@Injectable()
export class VmActionsService implements ActionsService<VirtualMachine, VirtualMachineAction> {
  public Actions: Array<VirtualMachineAction> = [
    {
      action: VmActions.START,
      name: 'START',
      icon: 'play_arrow',
      canActivate: vm => this.vmActionCheckerService.canStart(vm),
      activate: vm => this.start(vm),
      tokens: {
        name: 'Start',
        commandName: 'start',
        nameLower: 'start',
        nameCaps: 'START',
        vmStateOnAction: 'START_IN_PROGRESS',
        vmActionCompleted: 'START_DONE',
        confirmMessage: 'CONFIRM_VM_START',
        progressMessage: 'VM_START_IN_PROGRESS',
        successMessage: 'START_DONE'
      }
    },
    {
      action: VmActions.STOP,
      name: 'STOP',
      icon: 'stop',
      canActivate: vm => this.vmActionCheckerService.canStop(vm),
      activate: vm => this.stop(vm),
      tokens: {
        name: 'Stop',
        commandName: 'stop',
        nameLower: 'stop',
        nameCaps: 'STOP',
        vmStateOnAction: 'STOP_IN_PROGRESS',
        vmActionCompleted: 'STOP_DONE',
        confirmMessage: 'CONFIRM_VM_STOP',
        progressMessage: 'VM_STOP_IN_PROGRESS',
        successMessage: 'STOP_DONE'
      }
    },
    {
      action: VmActions.REBOOT,
      name: 'REBOOT',
      icon: 'replay',
      canActivate: vm => this.vmActionCheckerService.canReboot(vm),
      activate: vm => this.reboot(vm),
      tokens: {
        name: 'Reboot',
        commandName: 'reboot',
        nameLower: 'reboot',
        nameCaps: 'REBOOT',
        vmStateOnAction: 'REBOOT_IN_PROGRESS',
        vmActionCompleted: 'STOP_DONE',
        confirmMessage: 'CONFIRM_VM_STOP',
        progressMessage: 'VM_STOP_IN_PROGRESS',
        successMessage: 'STOP_DONE'
      }
    },
    {
      action: VmActions.RESTORE,
      name: 'RESTORE',
      icon: 'settings_backup_restore',
      canActivate: vm => this.vmActionCheckerService.canRestore(vm),
      activate: (vm, template) => this.restore(vm, template),
      tokens: {
        name: 'Restore',
        commandName: 'restore',
        nameLower: 'restore',
        nameCaps: 'RESTORE',
        vmStateOnAction: 'RESTORE_IN_PROGRESS',
        vmActionCompleted: 'RESTORE_DONE',
        confirmMessage: 'CONFIRM_VM_RESTORE',
        progressMessage: 'VM_RESTORE_IN_PROGRESS',
        successMessage: 'RESTORE_DONE'
      }
    },
    {
      action: VmActions.DESTROY,
      name: 'DESTROY',
      icon: 'delete',
      canActivate: vm => this.vmActionCheckerService.canDestroy(vm),
      activate: vm => this.destroy(vm),
      tokens: {
        name: 'Destroy',
        commandName: 'destroy',
        nameLower: 'destroy',
        nameCaps: 'DESTROY',
        vmStateOnAction: 'DESTROY_IN_PROGRESS',
        vmActionCompleted: 'DESTROY_DONE',
        confirmMessage: 'CONFIRM_VM_DESTROY',
        progressMessage: 'VM_DESTROY_IN_PROGRESS',
        successMessage: 'DESTROY_DONE'
      }
    },
    {
      action: VmActions.RESET_PASSWORD,
      name: 'RESET_PASSWORD',
      icon: 'vpn_key',
      canActivate: vm => this.vmActionCheckerService.canResetPassword(vm),
      activate: vm => this.resetPassword(vm),
      tokens: {
        name: 'ResetPasswordFor',
        commandName: 'resetPasswordFor',
        nameLower: 'resetpasswordfor',
        nameCaps: 'RESETPASSWORDFOR',
        vmStateOnAction: 'RESETPASSWORDFOR_IN_PROGRESS',
        vmActionCompleted: 'RESETPASSWORDFOR_DONE',
        confirmMessage: 'CONFIRM_VM_RESETPASSWORDFOR',
        progressMessage: 'VM_RESETPASSWORDFOR_IN_PROGRESS',
        successMessage: 'RESETPASSWORDFOR_DONE'
      }
    },
    {
      action: VmActions.CONSOLE,
      name: 'CONSOLE',
      icon: 'computer',
      canActivate: vm => this.vmActionCheckerService.canShowConsole(vm),
      activate: vm => this.showConsole(vm)
    },
    {
      action: VmActions.WEB_SHELL,
      name: 'WEB_SHELL',
      icon: 'computer',
      hidden: vm => this.vmActionCheckerService.isWebShellHidden(vm),
      canActivate: vm => this.vmActionCheckerService.canShowWebShell(vm),
      activate: vm => this.showWebShell(vm)
    }
  ];

  constructor(
    private vmActionCheckerService: VmActionsCheckerService,
    private webShellService: WebShellService
  ) {}

  public getAction(actionName: string): VirtualMachineAction {
    return this.Actions.find(_ => _.action === actionName);
  }

  private start(vm: VirtualMachine): void {}

  private stop(vm: VirtualMachine): void {}

  private reboot(vm: VirtualMachine): void {}

  private restore(vm: VirtualMachine, template: BaseTemplateModel): void {}

  private destroy(vm: VirtualMachine): void {}

  private resetPassword(vm: VirtualMachine): void {}

  private showConsole(vm: VirtualMachine): void {
    window.open(
      `client/console?cmd=access&vm=${vm.id}`,
      vm.displayName,
      'resizable=0,width=820,height=640'
    );
  }

  private showWebShell(vm: VirtualMachine): void {
    this.webShellService
      .getWebShellAddress(vm)
      .subscribe(address => window.open(address));
  }
}
