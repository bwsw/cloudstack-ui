import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { AffinityGroup, AffinityGroupTypesMap } from '../../../../shared/models';


@Component({
  selector: 'cs-affinity-group-list',
  templateUrl: 'affinity-group-list.component.html',
  styleUrls: ['affinity-group-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AffinityGroupListComponent implements OnChanges {
  @Input() public affinityGroups: AffinityGroup[];
  @Input() public isVmCreation: boolean;
  @Output() public selectedGroupChange = new EventEmitter<AffinityGroup>();
  public displayedColumns = ['name', 'type', 'description', 'radioButton'];
  public selectedGroup: AffinityGroup;

  public get AffinityGroupTypesMap() {
    return AffinityGroupTypesMap;
  }
  public ngOnChanges(changes: SimpleChanges) {
    const affinityGroups = changes.affinityGroups;
    if (affinityGroups) {
      this.affinityGroups = affinityGroups.currentValue;
    }
  }
  public selectGroupChange(group: AffinityGroup) {
    if (!this.isDisabledAffinityGroup(group.id)) {
      this.selectedGroupChange.emit(group)
    }
  }

  public isDisabledAffinityGroup(affinityGroupId: string): boolean {
    if (this.isVmCreation) {
      return false;
    }
    const group = this.affinityGroups.find(affinityGroup => affinityGroup.id === affinityGroupId);
    return group && group.isPreselected;
  }

  public isSelectedAffinityGroup(affinityGroup: AffinityGroup): boolean {
    if (this.isVmCreation) {
      return affinityGroup.isPreselected;
    }
    return this.selectedGroup && this.selectedGroup.id === affinityGroup.id;
  }

  public selectAffinityGroup(affinityGroupId: string) {
    this.selectedGroup = this.affinityGroups.find(group => group.id === affinityGroupId);
  }
}
