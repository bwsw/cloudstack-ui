import { Component, Input } from '@angular/core';
import { VirtualMachine } from '../../../../shared/vm.model';


@Component({
  selector: 'cs-nic-list',
  templateUrl: 'nic-list.component.html'
})
export class NicListComponent {
  @Input() public vm: VirtualMachine;
}
