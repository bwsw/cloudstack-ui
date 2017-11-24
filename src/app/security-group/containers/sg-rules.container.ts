import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import * as fromSecurityGroups from '../../reducers/security-groups/redux/sg.reducers';
import * as securityGroupActions from '../../reducers/security-groups/redux/sg.actions';


@Component({
  selector: 'cs-sg-rules-container',
  template: `
    <cs-security-group-rules
      [securityGroup]="securityGroup$ | async"
      [vmId]="vmId"
      [editMode]="editMode"
      (onCloseDialog)="closeDialog()"
    ></cs-security-group-rules>`
})
export class SgRulesContainerComponent implements OnInit {
  readonly securityGroup$ = this.store.select(fromSecurityGroups.getSelectedSecurityGroup);

  public id: string;
  public vmId: string;
  public editMode = false;

  constructor(
    private store: Store<State>,
    public dialogRef: MatDialogRef<SgRulesContainerComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.id = data.securityGroupId;

    if (data.vmId) {
      this.vmId = data.vmId;
      this.store.dispatch(new securityGroupActions.LoadSGRequest());
    }

    this.editMode = !!data.editMode;
  }

  public ngOnInit() {
    this.store.dispatch(new securityGroupActions.LoadSelectedSG(this.id));
  }

  public closeDialog() {
    this.dialogRef.close();
  }
}
