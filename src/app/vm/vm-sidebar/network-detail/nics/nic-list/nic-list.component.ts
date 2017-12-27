import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { VirtualMachine } from '../../../../shared/vm.model';
import { IpAddress } from '../../../../../shared/models/ip-address.model';


@Component({
  selector: 'cs-nic-list',
  templateUrl: 'nic-list.component.html'
})
export class NicListComponent {
  @Input() public vm: VirtualMachine;
  @Output() public onSecondaryIpAdd = new EventEmitter<string>();
  @Output() public onSecondaryIpRemove = new EventEmitter<IpAddress>();
}
