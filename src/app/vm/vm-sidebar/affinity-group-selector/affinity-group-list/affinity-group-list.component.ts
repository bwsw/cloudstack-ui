import {
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { AffinityGroup } from '../../../../shared/models';


export abstract class AffinityGroupListComponent implements OnChanges {
  protected affinityGroups: AffinityGroup[];
  protected selectedGroupChange = new EventEmitter<AffinityGroup>();
  public displayedColumns = ['name', 'type', 'radioButton'];
  public selectedGroup: AffinityGroup;

  public ngOnChanges(changes: SimpleChanges) {
    const affinityGroups = changes.affinityGroups;
    if (affinityGroups) {
      this.affinityGroups = affinityGroups.currentValue;
    }
  }

  public abstract isDisabledAffinityGroup(affinityGroupId: string): boolean;

  public selectAffinityGroup(group: AffinityGroup): void {
    this.selectedGroup = this.affinityGroups.find(ag => ag.id === group.id);
    this.selectedGroupChange.emit(group)
  }
}
