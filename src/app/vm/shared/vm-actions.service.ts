import { Injectable } from '@angular/core';
import { VirtualMachineAction, VirtualMachineActionType, VmActions } from '../vm-actions/vm-action';
import { VirtualMachine } from './vm.model';
import { ActionsService } from '../../shared/interfaces/action-service.interface';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { VmEntityDeletionService } from './vm-entity-deletion.service';
import { VmService } from './vm.service';
import { WebShellService } from '../web-shell/web-shell.service';
import { VmStartAction } from '../vm-actions/vm-start';
import { VmStopAction } from '../vm-actions/vm-stop';
import { VmRebootAction } from '../vm-actions/vm-reboot';
import { VmRestoreAction } from '../vm-actions/vm-restore';
import { VmDestroyAction } from '../vm-actions/vm-destroy';
import { VmResetPasswordAction } from '../vm-actions/vm-reset-password';
import { VmConsoleAction } from '../vm-actions/vm-console';
import { VmWebShellAction } from '../vm-actions/vm-webshell';
import { VmChangeServiceOfferingAction } from '../vm-actions/vm-change-service-offering';
import { ServiceOffering } from '../../shared/models/service-offering.model';
import { VmStartActionSilent } from '../vm-actions/silent/vm-start-silent';
import { VmStopActionSilent } from '../vm-actions/silent/vm-stop-silent';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';


@Injectable()
export class VmActionsService implements ActionsService<VirtualMachine, VirtualMachineAction> {
  public Actions = [
    this.vmStartAction,
    this.vmStopAction,
    this.vmRebootAction,
    this.vmRestoreAction,
    this.vmDestroyAction,
    this.vmResetPasswordAction,
    this.vmConsoleAction,
    this.vmWebShellAction
  ];

  constructor(
    public vmStartAction: VmStartAction,
    public vmStartActionSilent: VmStartActionSilent,
    public vmStopAction: VmStopAction,
    public vmStopActionSilent: VmStopActionSilent,
    public vmRebootAction: VmRebootAction,
    public vmRestoreAction: VmRestoreAction,
    public vmDestroyAction: VmDestroyAction,
    public vmResetPasswordAction: VmResetPasswordAction,
    public vmConsoleAction: VmConsoleAction,
    public vmWebShellAction: VmWebShellAction,
    public vmChangeServiceOfferingAction: VmChangeServiceOfferingAction
  ) {}

  public getActionByName(name: VirtualMachineActionType): VirtualMachineAction {
    switch (name) {
      case VmActions.START:
        return this.vmStartAction;
      case VmActions.STOP:
        return this.vmStopAction;
      case VmActions.REBOOT:
        return this.vmRebootAction;
      case VmActions.RESTORE:
        return this.vmRestoreAction;
      case VmActions.DESTROY:
        return this.vmDestroyAction;
      case VmActions.RESET_PASSWORD:
        return this.vmResetPasswordAction;
      case VmActions.CONSOLE:
        return this.vmConsoleAction;
      case VmActions.WEB_SHELL:
        return this.vmWebShellAction;
      default:
        throw new Error('Unknown VM action');
    }
  }
}
