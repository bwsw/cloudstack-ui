import { Component, Input } from '@angular/core';
import { MdDialog } from '@angular/material';
import { InstanceGroupEnabled } from '../../../interfaces/instance-group-enabled';
import {
  InstanceGroupSelectorComponent,
  InstanceGroupSelectorData
} from '../instance-group-selector/instance-group-selector.component';
import { InstanceGroupEnabledService } from '../../../interfaces/instance-group-enabled-service';


@Component({
  selector: 'cs-instance-group',
  templateUrl: 'instance-group.component.html',
  styleUrls: ['instance-group.component.scss']
})
export class InstanceGroupComponent {
  @Input() public entity: InstanceGroupEnabled;
  @Input() public entityService: InstanceGroupEnabledService;

  constructor(private dialog: MdDialog) {}

  public get groupName(): string {
    return this.entity.instanceGroup && this.entity.instanceGroup.name;
  }

  public changeGroup(): void {
    this.dialog.open(InstanceGroupSelectorComponent, {
      width: '350px',
      data: this.instanceGroupSelectorParams
    });
  }

  private get instanceGroupSelectorParams(): InstanceGroupSelectorData {
    return {
      entity: this.entity,
      entityService: this.entityService
    };
  }
}
