import { Component } from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import { configSelectors } from '../../root-store';

import * as fromSecurityGroups from '../../reducers/security-groups/redux/sg.reducers';
import * as fromVM from '../../reducers/vm/redux/vm.reducers';

@Component({
  selector: 'cs-sg-details-container',
  template: `
    <cs-security-group-details
      [securityGroup]="securityGroup$ | async"
      [defaultGroupName]="defaultGroupName$ | async"
    ></cs-security-group-details>
    <cs-security-group-vm-list
      [viewMode]="viewMode$ | async"
      [vmList]="vmList$ | async"
    ></cs-security-group-vm-list>
  `
})
export class SecurityGroupDetailsContainerComponent {
  readonly securityGroup$ = this.store.select(fromSecurityGroups.getSelectedSecurityGroup);
  readonly vmList$ = this.store.select(fromVM.getUsingSGVMs);
  readonly viewMode$ = this.store.select(fromSecurityGroups.viewMode);
  readonly defaultGroupName$ = this.store.select(configSelectors.get('defaultGroupName'));

  constructor(
    private store: Store<State>
  ) { }
}
