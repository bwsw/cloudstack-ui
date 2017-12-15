import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { State } from '../../../../../reducers/vm/redux/vm.reducers';
import { VmCreationSecurityGroupData } from '../../../security-group/vm-creation-security-group-data';

import * as fromSecurityGroups from '../../../../../reducers/security-groups/redux/sg.reducers';
import * as securityGroupActions from '../../../../../reducers/security-groups/redux/sg.actions';

@Component({
  selector: 'cs-vm-creation-security-group-container',
  template: `
    <cs-vm-creation-security-group
      [sharedGroups]="sharedGroups$ | async"
      [savedData]="savedData"
      (onSave)="onSave($event)"
      (onCancel)="onCancel()"
    ></cs-vm-creation-security-group>`
})
export class VmCreationSecurityGroupContainerComponent {
  public sharedGroups$ = this.store.select(fromSecurityGroups.selectSecurityGroupsForVmCreation);

  constructor(
    @Inject(MAT_DIALOG_DATA) public savedData: VmCreationSecurityGroupData,
    private dialogRef: MatDialogRef<VmCreationSecurityGroupContainerComponent>,
    private store: Store<State>
  ) {
    this.store.dispatch(new securityGroupActions.LoadSecurityGroupRequest());
  }

  public onSave(): void {
    this.dialogRef.close(this.savedData);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
