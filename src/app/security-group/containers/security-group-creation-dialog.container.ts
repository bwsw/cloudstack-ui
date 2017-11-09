import { Component } from '@angular/core';
import { SecurityGroup } from '../sg.model';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import * as securityGroupActions from '../../reducers/security-groups/redux/sg.actions';
import * as fromSecurityGroups from '../../reducers/security-groups/redux/sg.reducers';

@Component({
  selector: 'cs-security-group-create-dialog-container',
  template: `
    <cs-security-group-create-dialog
      [viewMode]="viewMode$ | async"
      (securityGroupCreate)="onSecurityGroupCreated($event)"
      
    ></cs-security-group-create-dialog>`
})
export class SecurityGroupCreationDialogContainerComponent {
  readonly viewMode$ = this.store.select(fromSecurityGroups.viewMode);

  constructor(private store: Store<State>) {
  }

  private onSecurityGroupCreated(securityGroup: SecurityGroup): void {
    this.store.dispatch(new securityGroupActions.CreateSGSuccess(securityGroup));
  }
}
