import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import * as securityGroupActions from '../../reducers/security-groups/redux/sg.actions';
import { ActivatedRoute } from '@angular/router';
import { SgRulesContainerComponent } from './sg-rules.container';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'cs-security-group-actions-container',
  template: `
    <cs-security-group-actions
      [securityGroup]="securityGroup"
      (onSecurityGroupView)="onViewSecurityGroup($event)"
      (onSecurityGroupDelete)="onDeleteSecurityGroup($event)"
    ></cs-security-group-actions>`
})
export class SecurityGroupActionsContainerComponent {
  @Input() public securityGroup;

  constructor(
    private store: Store<State>,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {
  }

  public onDeleteSecurityGroup(securityGroup) {
    this.store.dispatch(new securityGroupActions.DeleteSecurityGroup(securityGroup));
  }

  public onViewSecurityGroup(securityGroup): Observable<any> {
    const editMode = this.activatedRoute.snapshot.queryParams.hasOwnProperty('vm');

    return this.dialog.open(SgRulesContainerComponent, <MatDialogConfig>{
      width: '910px',
      data: { securityGroupId: securityGroup.id, editMode }
    })
      .afterClosed();
  }
}
