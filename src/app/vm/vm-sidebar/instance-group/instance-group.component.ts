import { Component, Input } from '@angular/core';
import { VirtualMachine } from '../../shared/vm.model';
import { MdlDialogService } from '@angular-mdl/core';
import { InstanceGroupSelectorComponent } from '../instance-group-selector/instance-group-selector.component';


@Component({
  selector: 'cs-instance-group',
  templateUrl: 'instance-group.component.html',
  styleUrls: ['instance-group.component.scss']
})
export class InstanceGroupComponent {
  @Input() public vm: VirtualMachine;

  constructor(private dialogService: MdlDialogService) {}

  public get groupName(): string {
    return this.vm.instanceGroup && this.vm.instanceGroup.name;
  }

  public changeGroup(): void {
    this.dialogService.showCustomDialog({
      component: InstanceGroupSelectorComponent,
      classes: 'instance-group-selector-dialog',
      providers: [
        {
          provide: 'vm',
          useValue: this.vm
        }
      ]
    });
  }
}
