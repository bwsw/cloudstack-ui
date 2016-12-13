import { Component, Input } from '@angular/core';

import { VirtualMachine } from './vm.model';

@Component({
  selector: 'cs-vm-list-item',
  templateUrl: './vm-list-item.component.html',
  styleUrls: ['./vm-list-item.component.scss']
})
export class VmListItemComponent {
  @Input() public vm: VirtualMachine;
}
