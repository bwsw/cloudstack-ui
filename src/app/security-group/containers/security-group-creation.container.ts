import { Component } from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import * as securityGroupActions from '../../reducers/security-groups/redux/sg.actions';
import * as fromSecurityGroups from '../../reducers/security-groups/redux/sg.reducers';

@Component({
  selector: 'cs-security-group-creation-container',
  template: `
    <cs-security-group-creation
      [mode]="viewMode$ | async"
      [creationInProgress]="isLoading$ | async"
      (cancel)="onCancel()"
      (createSecurityGroup)="onSecurityGroupCreation($event)"
    ></cs-security-group-creation>`
})
export class SecurityGroupCreationContainerComponent {
  readonly isLoading$ = this.store.select(fromSecurityGroups.isFormLoading);
  readonly viewMode$ = this.store.select(fromSecurityGroups.viewMode);

  constructor(
    private store: Store<State>,
    private router: Router
  ) {
  }

  public onSecurityGroupCreation(creationParams) {
    this.store.dispatch(new securityGroupActions.CreateSecurityGroup(creationParams));
  }

  public onCancel(): void {
    this.router.navigate(['../security-group'], {
      queryParamsHandling: 'preserve'
    });
  }
}
