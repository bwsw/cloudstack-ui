import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList,
} from '@angular/core';

import { VirtualMachine } from '../../shared/vm.model';
import { VmListSubsection, VmListSubsectionComponent } from '../vm-list-subsection/vm-list-subsection.component';
import { VmListItemComponent } from '../vm-list-item.component';


export interface VmListSection {
  name: string;
  vmList?: Array<VirtualMachine>;
  subsectionList?: Array<VmListSubsection>;
}

@Component({
  selector: 'cs-vm-list-section',
  templateUrl: 'vm-list-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VmListSectionComponent {
  @Input() public sectionName: string;
  @ContentChildren(VmListItemComponent) public vms: QueryList<VmListItemComponent>;
  @ContentChildren(VmListSubsectionComponent) public subsections: QueryList<VmListSubsectionComponent>;
}
