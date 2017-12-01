import { VmListItemComponent } from '../vm-list-item.component';
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
import { OsType } from '../../../shared/models/os-type.model';
import { Volume } from '../../../shared/models/volume.model';

@Component({
  selector: 'cs-vm-card-list-item',
  templateUrl: 'vm-list-card-item.component.html',
  styleUrls: ['vm-list-card-item.component.scss']
})
export class VmListCardItemComponent extends VmListItemComponent {
  @Input() public item: VirtualMachine;
  @Input() public volumes: Array<Volume>;
  @Input() public osTypesMap: { [key: string]: OsType };
  @Input() public query: string;
  @Input() public isSelected: (vm: VirtualMachine) => boolean;
  @Output() public onClick = new EventEmitter();
  @ViewChild(MatMenuTrigger) public matMenuTrigger: MatMenuTrigger;

  constructor(vmTagService: VmTagService) {
    super(vmTagService);
  }

}
