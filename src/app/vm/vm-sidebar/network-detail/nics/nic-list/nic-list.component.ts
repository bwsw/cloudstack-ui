import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { VirtualMachine } from '../../../../shared/vm.model';


@Component({
  selector: 'cs-nic-list',
  templateUrl: 'nic-list.component.html'
})
export class NicListComponent {
  @Input() public vm: VirtualMachine;
  @Output() public onSecondaryIpAdd = new EventEmitter();
  @Output() public onSecondaryIpRemove = new EventEmitter();
}
