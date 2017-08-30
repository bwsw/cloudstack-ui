import { Component, Input } from '@angular/core';
import { MdDialog } from '@angular/material';
import { VirtualMachine } from '../../shared/vm.model';
import { InstanceGroupSelectorComponent } from '../instance-group-selector/instance-group-selector.component';


@Component({
  selector: 'cs-instance-group',
  templateUrl: 'instance-group.component.html',
  styleUrls: ['instance-group.component.scss']
})
export class InstanceGroupComponent {
  @Input() public vm: VirtualMachine;

  constructor(private dialog: MdDialog) {}

  public get groupName(): string {
    return this.vm.instanceGroup && this.vm.instanceGroup.name;
  }

  public changeGroup(): void {
    this.dialog.open(InstanceGroupSelectorComponent, {
      width: '350px',
      data: this.vm
    });
  }
}
