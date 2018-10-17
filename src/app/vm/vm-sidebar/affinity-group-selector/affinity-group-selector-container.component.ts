import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AffinityGroup, AffinityGroupType } from '../../../shared/models';
import { AffinityGroupService } from '../../../shared/services/affinity-group.service';
import { select, Store } from '@ngrx/store';
import { State } from '../../../reducers';
import * as affinityGroupActions from '../../../reducers/affinity-groups/redux/affinity-groups.actions';
import * as affinityGroupSelectors from '../../../reducers/affinity-groups/redux/affinity-groups.selectors';


@Component({
  selector: 'cs-affinity-group-container-selector',
  template: `
  <cs-affinity-group-selector
    [affinityGroups]="affinityGroups$ | async"
    [isVmCreation]="isVmCreation"
    [preselectedAffinityGroups]="preselectedAffinityGroups"
    (onCreateAffinityGroup)="createAffinityGroup($event)"
    (onCancel)="cancel()"
    (onSubmit)="submit($event)"
  ></cs-affinity-group-selector>
  `,
})
export class AffinityGroupSelectorContainerComponent {
  readonly affinityGroups$;
  public types = [AffinityGroupType.antiAffinity, AffinityGroupType.affinity];
  public preselectedAffinityGroups: AffinityGroup[];
  public isVmCreation: boolean;

  constructor(
    private store: Store<State>,
    private affinityGroupService: AffinityGroupService,
    private dialogRef: MatDialogRef<AffinityGroupSelectorContainerComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.isVmCreation = data.isVmCreation;
    this.preselectedAffinityGroups = data.preselectedAffinityGroups || [];
    this.affinityGroups$ = this.store.pipe(
      select(affinityGroupSelectors.getSelectSorted(this.preselectedAffinityGroups)));
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
