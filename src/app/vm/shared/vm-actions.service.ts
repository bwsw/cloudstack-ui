import { Injectable } from '@angular/core';
import { ActionsService } from '../../shared/interfaces/action-service.interface';
import {
  VmConsoleAction,
  VmDestroyAction,
  VmPulseAction,
  VmRebootAction,
  VmResetPasswordAction,
  VmRestoreAction,
  VmStartAction,
  VmStopAction,
  VmWebShellAction
} from '../vm-actions';
import { VmStartActionSilent } from '../vm-actions/silent/vm-start-silent';
import { VmStopActionSilent } from '../vm-actions/silent/vm-stop-silent';
import {
  VirtualMachineAction,
  VmActions
} from '../vm-actions/vm-action';
import { VmChangeServiceOfferingAction } from '../vm-actions/vm-change-service-offering';
import { VirtualMachine } from './vm.model';
import { VmAccessAction } from '../vm-actions/vm-access';


@Injectable()
export class VmActionsService implements ActionsService<VirtualMachine, VirtualMachineAction> {
  public actions = [
    this.vmStartAction,
    this.vmStopAction,
    this.vmRebootAction,
    this.vmRestoreAction,
    this.vmDestroyAction,
    this.vmResetPasswordAction,
    this.vmAccessAction
  ];

  public pluginActions = [
    this.vmPulseAction,
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
    public vmPulseAction: VmPulseAction,
    public vmChangeServiceOfferingAction: VmChangeServiceOfferingAction,
    public vmAccessAction: VmAccessAction
  ) {}

  public getActionByName(name: VmActions): VirtualMachineAction {
    const actions = {
      [VmActions.START]: this.vmStartAction,
      [VmActions.STOP]: this.vmStopAction,
      [VmActions.REBOOT]: this.vmRebootAction,
      [VmActions.RESTORE]: this.vmRestoreAction,
      [VmActions.DESTROY]: this.vmDestroyAction,
      [VmActions.RESET_PASSWORD]: this.vmResetPasswordAction,
      [VmActions.PULSE]: this.vmWebShellAction,
      [VmActions.ACCESS]: this.vmAccessAction
    };

    return actions[name];
  }
}
