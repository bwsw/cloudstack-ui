import {
  Component,
  Input
} from '@angular/core';
import { VirtualMachine } from '../../../shared/vm.model';


@Component({
  selector: 'cs-vm-detail',
  templateUrl: 'vm-detail.component.html',
  styleUrls: ['vm-detail.component.scss']
})
export class VmDetailComponent {
  @Input() public vm: VirtualMachine;
}
