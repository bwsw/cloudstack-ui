import { Component, Input } from '@angular/core';
import { VmActionsService } from '../../shared/vm-actions.service';
import { VirtualMachine } from '../../shared/vm.model';
import { VirtualMachineAction } from '../vm-action';


@Component({
  selector: 'cs-vm-actions',
  templateUrl: 'vm-actions.component.html'
})
export class VmActionsComponent {
  @Input() public vm: VirtualMachine;

  public firstRowActions: Array<VirtualMachineAction>;
  public secondRowActions: Array<VirtualMachineAction>;

  constructor(public vmActionsService: VmActionsService) {
    this.firstRowActions = this.vmActionsService.actions.slice(0, 7);
    this.secondRowActions = this.vmActionsService.actions.slice(7, 9);
  }

  public onAction(action: VirtualMachineAction, vm: VirtualMachine): void {
    action.activate(vm).subscribe();
  }
}
