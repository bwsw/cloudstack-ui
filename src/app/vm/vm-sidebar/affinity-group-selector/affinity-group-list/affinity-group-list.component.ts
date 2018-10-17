import {
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { AffinityGroup } from '../../../../shared/models';


export abstract class AffinityGroupListComponent implements OnChanges {
  protected affinityGroups: AffinityGroup[];
  protected selectedGroupChange = new EventEmitter<AffinityGroup>();
  public displayedColumns = ['name', 'type', 'description', 'radioButton'];
  public selectedGroup: AffinityGroup;

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

  public abstract isDisabledAffinityGroup(affinityGroupId: string): boolean;

  public selectAffinityGroup(affinityGroupId: string) {
    this.selectedGroup = this.affinityGroups.find(group => group.id === affinityGroupId);
  }
}
