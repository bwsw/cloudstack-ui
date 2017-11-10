import {
  Component,
  Input
} from '@angular/core';
import { VirtualMachine } from '../../../vm/shared/vm.model';


@Component({
  selector: 'cs-security-group-vm-list',
  templateUrl: 'security-group-vm-list.component.html',
  styleUrls: ['security-group-vm-list.component.scss']
})
export class SecurityGroupVmListComponent {
  @Input() public vmList: VirtualMachine[];

  public getVmLink(vm: VirtualMachine) {
    return `/instances/${vm.id}/vm`;
  }
}
