import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import * as securityGroupActions from '../../reducers/security-groups/redux/sg.actions';

@Component({
  selector: 'cs-security-group-actions-container',
  template: `
    <cs-security-group-actions
      [securityGroup]="securityGroup"
      (onSecurityGroupDelete)="onDeleteSecurityGroup($event)"
    ></cs-security-group-actions>`
})
export class SecurityGroupActionsContainerComponent {
  @Input() public securityGroup;

  constructor(private store: Store<State>) {
  }

  public onDeleteSecurityGroup(securityGroup) {
    this.store.dispatch(new securityGroupActions.RemoveSGSuccess(securityGroup));
  }
}
