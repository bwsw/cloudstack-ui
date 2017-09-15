import { Component, Input } from '@angular/core';
import { NIC } from '../../../../../shared/models/nic.model';
import { VirtualMachine } from '../../../../shared/vm.model';


@Component({
  selector: 'cs-nic',
  templateUrl: 'nic.component.html',
  styleUrls: ['../nics.scss'],
})
export class NicComponent {
  @Input() public name: string;
  @Input() public nic: NIC;
  @Input() public vm: VirtualMachine;
}
