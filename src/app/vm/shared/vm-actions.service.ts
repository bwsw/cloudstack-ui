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


@Injectable()
export class VmActionsService implements ActionsService<VirtualMachine, VirtualMachineAction> {
  public Actions = [
    this.getStartAction(),
    this.getStopAction(),
    this.getRebootAction(),
    this.getRestoreAction(),
    this.getDestroyAction(),
    this.getResetPasswordAction(),
    this.getConsoleAction(),
    this.getWebShellAction()
  ];

  constructor(
    private dialogService: DialogService,
    private vmEntityDeletionService: VmEntityDeletionService,
    private vmService: VmService,
    private webShellService: WebShellService
  ) {}

  public getActionByName(name: VirtualMachineActionType): VirtualMachineAction {
    switch (name) {
      case VmActions.START:
        return this.getStartAction();
      case VmActions.STOP:
        return this.getStopAction();
      case VmActions.REBOOT:
        return this.getRebootAction();
      case VmActions.RESTORE:
        return this.getRestoreAction();
      case VmActions.DESTROY:
        return this.getDestroyAction();
      case VmActions.RESET_PASSWORD:
        return this.getResetPasswordAction();
      case VmActions.CONSOLE:
        return this.getConsoleAction();
      case VmActions.WEB_SHELL:
        return this.getWebShellAction();
      default:
        throw new Error('Unknown VM action');
    }
  }

  public getStartAction(): VmStartAction {
    return new VmStartAction(this.dialogService, this.vmService);
  }

  public getStopAction(): VmStopAction {
    return new VmStopAction(this.dialogService, this.vmService);
  }

  public getRebootAction(): VmRebootAction {
    return new VmRebootAction(this.dialogService, this.vmService);
  }

  public getRestoreAction(): VmRestoreAction {
    return new VmRestoreAction(this.dialogService, this.vmService);
  }

  public getDestroyAction(): VmDestroyAction {
    return new VmDestroyAction(
      this.dialogService,
      this.vmService,
      this.vmEntityDeletionService
    );
  }

  public getResetPasswordAction(): VmResetPasswordAction {
    return new VmResetPasswordAction(
      this.dialogService,
      this.vmService,
      this
    );
  }

  public getConsoleAction(): VmConsoleAction {
    return new VmConsoleAction(this.dialogService, this.vmService);
  }

  public getWebShellAction(): VmWebShellAction {
    return new VmWebShellAction(
      this.dialogService,
      this.vmService,
      this.webShellService
    );
  }

  public getChangeServiceOfferingAction(serviceOffering: ServiceOffering): VmChangeServiceOfferingAction {
    return new VmChangeServiceOfferingAction(
      serviceOffering,
      this.dialogService,
      this.vmService,
      this,
    );
  }

  public getStartActionSilent(): VmStartActionSilent {
    return new VmStartActionSilent(
      this.dialogService,
      this.vmService
    );
  }

  public getStopActionSilent(): VmStopActionSilent {
    return new VmStopActionSilent(
      this.dialogService,
      this.vmService
    );
  }
}
