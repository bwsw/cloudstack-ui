import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import { SecurityGroup } from '../../security-group/sg.model';

import * as fromSecurityGroups from '../../reducers/security-groups/redux/sg.reducers';


@Component({
  selector: 'cs-sg-list-container',
  template: `
    <cs-vms-sg-list
      [securityGroups]="sharedGroups$ | async"
      [selectedSecurityGroups]="selectedSecurityGroups"
      [isLoading]="loading$ | async"
      (onSave)="onSave($event)"
      (onCancel)="onCancel()"
    ></cs-vms-sg-list>`
})
export class SgListContainerComponent {
  readonly sharedGroups$ = this.store.select(fromSecurityGroups.selectSecurityGroupsForVmCreation);
  readonly loading$ = this.store.select(fromSecurityGroups.isListLoading);
  public selectedSecurityGroups: Array<SecurityGroup>;

  constructor(
    private store: Store<State>,
    private dialogRef: MatDialogRef<SgListContainerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Array<SecurityGroup>,
  ) {
    this.selectedSecurityGroups = data;
  }

  public onSave(savedData: Array<SecurityGroup>): void {
    this.dialogRef.close(savedData);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
