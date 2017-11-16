import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { VirtualMachine } from '../../shared/vm.model';
import { MatMenuTrigger } from '@angular/material';
import { VmTagService } from '../../../shared/services/tags/vm-tag.service';
import { VmListItemComponent } from '../vm-list-item.component';

@Component({
  selector: 'cs-vm-row-list-item',
  templateUrl: 'vm-list-row-item.component.html',
  styleUrls: ['vm-list-row-item.component.scss']
})
export class VmListRowItemComponent extends VmListItemComponent {
  @Input() public item: VirtualMachine;
  @Input() public searchQuery: () => string;
  @Input() public isSelected: (vm: VirtualMachine) => boolean;
  @Output() public onClick = new EventEmitter();
  @ViewChild(MatMenuTrigger) public matMenuTrigger: MatMenuTrigger;

  constructor(vmTagService: VmTagService) {
    super(vmTagService);
  }

}
