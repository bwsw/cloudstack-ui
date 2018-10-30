import { Component, OnInit } from '@angular/core';
import { State } from '../../reducers';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

import * as fromSecurityGroups from '../../reducers/security-groups/redux/sg.reducers';
import * as securityGroupActions from '../../reducers/security-groups/redux/sg.actions';

@Component({
  selector: 'cs-sg-sidebar-container',
  template: `
    <cs-sg-sidebar
      [entity]="securityGroup$ | async"
    ></cs-sg-sidebar>`,
})
export class SecurityGroupSidebarContainerComponent implements OnInit {
  readonly securityGroup$ = this.store.pipe(select(fromSecurityGroups.getSelectedSecurityGroup));

  constructor(private store: Store<State>, private activatedRoute: ActivatedRoute) {}

  public ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.store.dispatch(new securityGroupActions.LoadSelectedSecurityGroup(params['id']));
  }
}
