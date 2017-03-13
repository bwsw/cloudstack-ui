import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';

import { VirtualMachine } from '../../shared/vm.model';


export interface VmListSubsection {
  name: string;
  vmList: Array<VirtualMachine>;
}

@Component({
  selector: 'cs-vm-list-subsection',
  templateUrl: 'vm-list-subsection.component.html',
  styleUrls: ['vm-list-subsection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VmListSubsectionComponent {
  @Input() public subsectionName: string;
}
