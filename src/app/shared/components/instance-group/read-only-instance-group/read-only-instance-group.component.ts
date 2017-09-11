import { Component, Input } from '@angular/core';
import { InstanceGroupEnabled } from '../../../interfaces/instance-group-enabled';


@Component({
  selector: 'cs-read-only-instance-group',
  templateUrl: 'read-only-instance-group.component.html'
})
export class ReadOnlyInstanceGroupComponent {
  @Input() public entity: InstanceGroupEnabled;

  public get groupName(): string {
    return this.entity.instanceGroup && this.entity.instanceGroup.name;
  }
}
