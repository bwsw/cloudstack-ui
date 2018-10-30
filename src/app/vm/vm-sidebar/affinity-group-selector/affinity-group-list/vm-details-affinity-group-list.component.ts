import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { AffinityGroup } from '../../../../shared/models';
import { AffinityGroupListComponent } from './affinity-group-list.component';

@Component({
  selector: 'cs-vm-details-affinity-group-list',
  templateUrl: 'affinity-group-list.component.html',
  styleUrls: ['affinity-group-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VmDetailsAffinityGroupListComponent extends AffinityGroupListComponent
  implements OnInit {
  @Input()
  public affinityGroups: AffinityGroup[];
  @Output()
  public selectedGroupChange = new EventEmitter<AffinityGroup>();
  public enablePreselected = true;

  public ngOnInit() {
    this.selectedGroup = this.affinityGroups.find(group => !group.isPreselected);
    this.selectedGroupChange.emit(this.selectedGroup);
  }

  public isDisabledAffinityGroup(affinityGroupId: string): boolean {
    const group = this.affinityGroups.find(affinityGroup => affinityGroup.id === affinityGroupId);
    return group && group.isPreselected;
  }

  public isSelectedAffinityGroup(affinityGroup: AffinityGroup): boolean {
    return this.selectedGroup && this.selectedGroup.id === affinityGroup.id;
  }
}
