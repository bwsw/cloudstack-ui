import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { VirtualMachine } from '../vm.model';


@Component({
  selector: 'cs-vm-sidebar',
  templateUrl: 'vm-sidebar.component.html'
})
export class VmSidebarComponent {
  @Input() public vm: VirtualMachine;
  @Input() public isOpen: boolean;
  @Output() public onClickOutside = new EventEmitter();
}
