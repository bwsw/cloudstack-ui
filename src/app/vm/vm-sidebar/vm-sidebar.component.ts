import { Component, Input } from '@angular/core';

import { VirtualMachine } from '../shared/vm.model';


@Component({
  selector: 'cs-vm-sidebar',
  templateUrl: 'vm-sidebar.component.html'
})
export class VmSidebarComponent {
  @Input() public vm: VirtualMachine;
}
