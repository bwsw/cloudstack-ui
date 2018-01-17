import { Component } from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';


import * as fromSecurityGroups from '../../reducers/security-groups/redux/sg.reducers';
import * as fromVM from '../../reducers/vm/redux/vm.reducers';

@Component({
  selector: 'cs-sg-details-container',
  template: `
    <cs-security-group-details
      [securityGroup]="securityGroup$ | async"
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


  constructor(
    private store: Store<State>
  ) { }
}
