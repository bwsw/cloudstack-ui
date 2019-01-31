import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { select, Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import { SecurityGroup } from '../../security-group/sg.model';

import * as fromSecurityGroups from '../../reducers/security-groups/redux/sg.reducers';
import * as securityGroupActions from '../../reducers/security-groups/redux/sg.actions';

@Component({
  selector: 'cs-sg-list-container',
  template: `
    <cs-vms-sg-list
      [securityGroups]="sortedGroups$ | async"
      [isLoading]="loading$ | async"
      (save)="onSave($event)"
      (cancel)="onCancel()"
    ></cs-vms-sg-list>
  `,
})
export class SgListContainerComponent {
  readonly sortedGroups$ = this.store.pipe(
    select(fromSecurityGroups.getSortedSecurityGroupForVmDetails),
  );
  readonly loading$ = this.store.pipe(select(fromSecurityGroups.isListLoading));

  constructor(
    private store: Store<State>,
    private dialogRef: MatDialogRef<SgListContainerComponent>,
  ) {
    this.store.dispatch(new securityGroupActions.LoadSecurityGroupRequest());
  }

  public onSave(savedData: SecurityGroup): void {
    this.dialogRef.close(savedData);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
