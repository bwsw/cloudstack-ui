import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import { State } from '../../reducers';
import * as securityGroupActions from '../../reducers/security-groups/redux/sg.actions';
import { SecurityGroup, SecurityGroupNative } from '../sg.model';

@Component({
  selector: 'cs-security-group-actions-container',
  template: `
    <cs-security-group-actions
      [securityGroup]="securityGroup"
      (securityGroupViewSelected)="onViewSecurityGroup($event)"
      (securityGroupDeleted)="onDeleteSecurityGroup($event)"
      (securityGroupConverted)="onSecurityGroupConvert($event)"
    ></cs-security-group-actions>`,
})
export class SecurityGroupActionsContainerComponent {
  @Input()
  public securityGroup;

  constructor(private store: Store<State>, private router: Router) {}

  public onDeleteSecurityGroup(securityGroup: SecurityGroup) {
    this.store.dispatch(new securityGroupActions.DeleteSecurityGroup(securityGroup));
  }

  public onViewSecurityGroup(securityGroup: SecurityGroup): Observable<any> {
    this.router.navigate(['security-group', securityGroup.id, 'rules'], {
      queryParamsHandling: 'preserve',
    });

    return of(securityGroup);
  }

  public onSecurityGroupConvert(securityGroup: SecurityGroupNative) {
    this.store.dispatch(new securityGroupActions.ConvertSecurityGroup(securityGroup));
  }
}
