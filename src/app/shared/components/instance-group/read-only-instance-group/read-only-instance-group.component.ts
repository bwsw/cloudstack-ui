import { Component, Input } from '@angular/core';
import { InstanceGroupEnabled } from '../../../interfaces/instance-group-enabled';
import { InstanceGroupTranslationService } from '../../../services/instance-group-translation.service';


@Component({
  selector: 'cs-read-only-instance-group',
  templateUrl: 'read-only-instance-group.component.html'
})
export class ReadOnlyInstanceGroupComponent {
  @Input() public entity: InstanceGroupEnabled;

  constructor(private instanceGroupTranslationService: InstanceGroupTranslationService) {}

  public get groupName(): string {
    return this.instanceGroupTranslationService.getGroupName(this.entity.instanceGroup);
  }
}
