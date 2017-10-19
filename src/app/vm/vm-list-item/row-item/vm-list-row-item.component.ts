import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { VirtualMachine } from '../../shared/vm.model';
import { MdMenuTrigger } from '@angular/material';
import { VmTagService } from '../../../shared/services/tags/vm-tag.service';
import { VmListItemComponent } from '../vm-list-item.component';

@Component({
  selector: 'cs-vm-row-list-item',
  templateUrl: 'vm-list-row-item.component.html',
  styleUrls: ['vm-list-row-item.component.scss']
})
export class VmListRowItemComponent extends VmListItemComponent {
  @Input() public item: VirtualMachine;
  @Input() public isSelected: (vm: VirtualMachine) => boolean;
  @Output() public onClick = new EventEmitter();
  @ViewChild(MdMenuTrigger) public mdMenuTrigger: MdMenuTrigger;

  constructor(vmTagService: VmTagService) {
    super(vmTagService);
  }

}
