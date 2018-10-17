import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AffinityGroup } from '../../../../shared/models';
import { AffinityGroupListComponent } from './affinity-group-list.component';


@Component({
  selector: 'cs-vm-creation-affinity-group-list',
  templateUrl: 'affinity-group-list.component.html',
  styleUrls: ['affinity-group-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VmCreationAffinityGroupListComponent extends AffinityGroupListComponent {
  @Input() public affinityGroups: AffinityGroup[];
  @Output() public selectedGroupChange = new EventEmitter<AffinityGroup>();
  public isVmCreation = true;

  public isDisabledAffinityGroup(affinityGroupId: string): boolean {
    return false;
  }

  public isSelectedAffinityGroup(affinityGroup: AffinityGroup): boolean {
    return affinityGroup.isPreselected;
  }
}
