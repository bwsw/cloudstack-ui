import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import * as securityGroupActions from '../../reducers/security-groups/redux/sg.actions';

@Component({
  selector: 'cs-security-group-actions-container',
  template: `
    <cs-security-group-actions
      [securityGroup]="securityGroup"
      (onSecurityGroupView)="onViewSecurityGroup($event)"
      (onSecurityGroupDelete)="onDeleteSecurityGroup($event)"
      (onSecurityGroupConvert)="onSecurityGroupConvert($event)"
    ></cs-security-group-actions>`
})
export class SecurityGroupActionsContainerComponent {
  @Input() public securityGroup;

  constructor(
    private store: Store<State>,
    private router: Router
  ) {
  }

  public onDeleteSecurityGroup(securityGroup) {
    this.store.dispatch(new securityGroupActions.DeleteSecurityGroup(securityGroup));
  }

  public onViewSecurityGroup(securityGroup): Observable<any> {
    this.router.navigate(
      ['security-group', securityGroup.id, 'rules'],
      { queryParamsHandling: 'preserve' }
    );

    return Observable.of(securityGroup);
  }

  public onSecurityGroupConvert(securityGroup) {
    this.store.dispatch(new securityGroupActions.ConvertSecurityGroup(securityGroup));
  }
}
