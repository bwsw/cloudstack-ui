import { Component } from '@angular/core';
import { State } from '../../reducers/index';
import { select, Store } from '@ngrx/store';

import * as securityGroupActions from '../../reducers/security-groups/redux/sg.actions';
import * as fromSecurityGroups from '../../reducers/security-groups/redux/sg.reducers';

@Component({
  selector: 'cs-security-group-creation-container',
  template: `
    <cs-security-group-creation
      [mode]="viewMode$ | async"
      [creationInProgress]="isLoading$ | async"
      (createSecurityGroup)="onSecurityGroupCreation($event)"
    ></cs-security-group-creation>`,
})
export class SecurityGroupCreationContainerComponent {
  readonly isLoading$ = this.store.pipe(select(fromSecurityGroups.isFormLoading));
  readonly viewMode$ = this.store.pipe(select(fromSecurityGroups.viewMode));

  constructor(private store: Store<State>) {}

  public onSecurityGroupCreation(creationParams) {
    this.store.dispatch(new securityGroupActions.CreateSecurityGroup(creationParams));
  }
}
