import { Component, Inject } from '@angular/core';
import { VirtualMachine } from '../../shared/vm.model';


@Component({
  selector: 'cs-instance-group-selector',
  templateUrl: 'instance-group-selector.component.html',
  styleUrls: ['instance-group-selector.component.scss']
})
export class InstanceGroupSelectorComponent {
  constructor(@Inject('vm') public vm: VirtualMachine) {}
}
