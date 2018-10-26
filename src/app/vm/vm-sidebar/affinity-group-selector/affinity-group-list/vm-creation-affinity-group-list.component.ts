import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AffinityGroup } from '../../../../shared/models';
import { AffinityGroupListComponent } from './affinity-group-list.component';

@Component({
  selector: 'cs-vm-creation-affinity-group-list',
  templateUrl: 'affinity-group-list.component.html',
  styleUrls: ['affinity-group-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VmCreationAffinityGroupListComponent extends AffinityGroupListComponent {
  @Input()
  public affinityGroups: AffinityGroup[];
  @Output()
  public selectedGroupChange = new EventEmitter<AffinityGroup>();
  public enablePreselected = false;

  public isDisabledAffinityGroup(affinityGroupId: string): boolean {
    return false;
  }

  public isSelectedAffinityGroup(affinityGroup: AffinityGroup): boolean {
    if (this.selectedGroup) {
      return this.selectedGroup.id === affinityGroup.id;
    }
    return affinityGroup.isPreselected;
  }
}
