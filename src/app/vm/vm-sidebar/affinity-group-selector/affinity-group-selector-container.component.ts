import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AffinityGroup, AffinityGroupType } from '../../../shared/models';
import { select, Store } from '@ngrx/store';
import { State } from '../../../reducers';
import * as affinityGroupActions from '../../../reducers/affinity-groups/redux/affinity-groups.actions';
import * as affinityGroupSelectors from '../../../reducers/affinity-groups/redux/affinity-groups.selectors';

@Component({
  selector: 'cs-affinity-group-container-selector',
  template: `
    <cs-affinity-group-selector
      [affinityGroups]="affinityGroups$ | async"
      [sortedAffinityGroups]="sortedAffinityGroups$ | async"
      [enablePreselected]="enablePreselected"
      [preselectedAffinityGroups]="preselectedAffinityGroups"
      (createdAffinityGroup)="createAffinityGroup($event)"
      (canceled)="cancel()"
      (submited)="submit($event)"
    ></cs-affinity-group-selector>
  `,
})
export class AffinityGroupSelectorContainerComponent {
  readonly affinityGroups$ = this.store.pipe(
    select(affinityGroupSelectors.getAffinityGroupsForVmForm),
  );
  readonly sortedAffinityGroups$ = this.store.pipe(
    select(affinityGroupSelectors.getSortedAffinityGroupsForVmDetails),
  );
  public types = [AffinityGroupType.antiAffinity, AffinityGroupType.affinity];
  public preselectedAffinityGroups: AffinityGroup[];
  public enablePreselected: boolean;

  constructor(
    private store: Store<State>,
    private dialogRef: MatDialogRef<AffinityGroupSelectorContainerComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.enablePreselected = data.enablePreselected;
    this.preselectedAffinityGroups = data.preselectedAffinityGroups || [];
  }

  public createAffinityGroup(group: AffinityGroup) {
    this.store.dispatch(new affinityGroupActions.CreateAffinityGroup(group));
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  public submit(groupIds: string[]): void {
    this.dialogRef.close(groupIds);
  }
}
