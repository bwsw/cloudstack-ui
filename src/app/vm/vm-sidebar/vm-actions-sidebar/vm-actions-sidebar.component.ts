import { Component, Input } from '@angular/core';
import { VirtualMachine } from '../../shared/vm.model';


@Component({
  selector: 'cs-vm-actions-sidebar',
  templateUrl: 'vm-actions-sidebar.component.html',
  styleUrls: ['vm-actions-sidebar.component.scss']
})
export class VmActionsSidebarComponent {
  @Input() public vm: VirtualMachine;
}
