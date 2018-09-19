import {
  Component,
  OnInit
} from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { configSelectors } from '../../root-store';

import * as fromSecurityGroups from '../../reducers/security-groups/redux/sg.reducers';
import * as securityGroupActions from '../../reducers/security-groups/redux/sg.actions';

@Component({
  selector: 'cs-sg-sidebar-container',
  template: `
    <cs-sg-sidebar
      [entity]="securityGroup$ | async"
      [defaultGroupName]="defaultGroupName$ | async"
    ></cs-sg-sidebar>`
})
export class SecurityGroupSidebarContainerComponent implements OnInit {
  readonly securityGroup$ = this.store.select(fromSecurityGroups.getSelectedSecurityGroup);
  readonly defaultGroupName$ = this.store.select(configSelectors.get('defaultGroupName'));

  constructor(
    private store: Store<State>,
    private activatedRoute: ActivatedRoute
  ) { }

  public ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.store.dispatch(new securityGroupActions.LoadSelectedSecurityGroup(params['id']));
  }
}
