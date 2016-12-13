import { Component, Input } from '@angular/core';

import { VirtualMachine } from './vm.model';

@Component({
  selector: 'cs-vm',
  templateUrl: './vm.component.html',
  styleUrls: ['./vm.component.scss']
})
export class VmComponent {
  @Input() public vm: VirtualMachine;
}
