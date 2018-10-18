import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { State } from '../../../../../reducers/vm/redux/vm.reducers';
import { VmCreationSecurityGroupData } from '../../../security-group/vm-creation-security-group-data';

import * as fromSecurityGroups from '../../../../../reducers/security-groups/redux/sg.reducers';

@Component({
  selector: 'cs-vm-creation-security-group-container',
  template: `
    <cs-vm-creation-security-group
      [sharedGroups]="sharedGroups$ | async"
      [savedData]="savedData"
      (saved)="onSave($event)"
      (canceled)="onCancel()"
    ></cs-vm-creation-security-group>`,
})
export class VmCreationSecurityGroupContainerComponent {
  readonly sharedGroups$ = this.store.pipe(
    select(fromSecurityGroups.selectSecurityGroupsForVmCreation),
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public savedData: VmCreationSecurityGroupData,
    private dialogRef: MatDialogRef<VmCreationSecurityGroupContainerComponent>,
    private store: Store<State>,
  ) {}

  public onSave(savedData: VmCreationSecurityGroupData): void {
    this.dialogRef.close(savedData);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
