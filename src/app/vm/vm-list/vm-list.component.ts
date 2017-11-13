import {
  Component,
  Input,
} from '@angular/core';

import { ListService } from '../../shared/components/list/list.service';
import {
  VirtualMachine,
  VmState
} from '../shared/vm.model';
import { VmListRowItemComponent } from '../vm-list-item/row-item/vm-list-row-item.component';
import { VmListCardItemComponent } from '../vm-list-item/card-item/vm-list-card-item.component';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';


@Component({
  selector: 'cs-vm-list',
  templateUrl: 'vm-list.component.html'
})
export class VmListComponent {
  @Input() public vms: Array<VirtualMachine>;
  @Input() public groupings: Array<any>;
  @Input() public mode: ViewMode;
  public inputs;
  public outputs;

  constructor(public listService: ListService) {
    this.inputs = {
      isSelected: item => this.listService.isSelected(item.id)
    };

    this.outputs = {
      onClick: this.selectVirtualMachine.bind(this),
    };
  }

  public get itemComponent() {
    return this.mode === ViewMode.BOX ? VmListCardItemComponent : VmListRowItemComponent;
  }

  public selectVirtualMachine(vm: VirtualMachine): void {
    if (vm.state !== VmState.Error && vm.state !== VmState.Deploying) {
      this.listService.showDetails(vm.id);
    }
  }
}
