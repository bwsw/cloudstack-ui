import { Component, Input } from '@angular/core';
import { VmActionsService } from '../../shared/vm-actions.service';
import { VirtualMachine, VmState } from '../../shared/vm.model';
import { VirtualMachineAction } from '../vm-action';
import { VmExpungeAction } from '../vm-expunge';
import { VmRecoverAction } from '../vm-recover';


@Component({
  selector: 'cs-vm-actions',
  templateUrl: 'vm-actions.component.html'
})
export class VmActionsComponent {
  @Input() public vm: VirtualMachine;

  public vmActions: Array<VirtualMachineAction>;
  public pluginActions: Array<VirtualMachineAction>;

  public destroyedVmActions: Array<VirtualMachineAction>;;

  public vmActionsContext: {};
  public pluginActionsContext: {};
  public destroyedVmActionsContext: {};

  constructor(
    private vmActionsService: VmActionsService,
    vmExpungeAction: VmExpungeAction,
    vmRecoverAction: VmRecoverAction
  ) {
    this.vmActions = this.vmActionsService.actions;
    this.pluginActions = this.vmActionsService.pluginActions;
    this.destroyedVmActions = [vmExpungeAction, vmRecoverAction];

    // https://angular.io/api/common/NgTemplateOutlet
    this.vmActionsContext = {
      $implicit: this.vmActions
    };
    this.pluginActionsContext  = {
      $implicit: this.pluginActions
    };
    this.destroyedVmActionsContext = {
      $implicit: this.destroyedVmActions
    };
  }

  public onAction(action: VirtualMachineAction, vm: VirtualMachine): void {
    action.activate(vm).subscribe();
  }

  public get vmIsDestroyed(): boolean {
    return this.vm.state === VmState.Destroyed;
  }

  public get hasPrimaryActions(): boolean {
    const predicate = action => !action.hidden(this.vm);
    return this.vmActions.some(predicate) || this.destroyedVmActions.some(predicate);
  }
}
