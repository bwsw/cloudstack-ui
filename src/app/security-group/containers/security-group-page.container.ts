import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { State } from '../../reducers/index';
import { select, Store } from '@ngrx/store';

import * as fromSecurityGroups from '../../reducers/security-groups/redux/sg.reducers';
import * as securityGroupActions from '../../reducers/security-groups/redux/sg.actions';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as fromVM from '../../reducers/vm/redux/vm.reducers';

@Component({
  selector: 'cs-security-group-page-container',
  template: `
    <cs-security-group-page
      [securityGroups]="securityGroups$ | async"
      [isLoading]="loading$ | async"
      [viewMode]="viewMode$ | async"
      [query]="query$ | async"
      [vmList]="vmList$ | async"
    ></cs-security-group-page>
  `,
})
export class SecurityGroupPageContainerComponent implements OnInit, AfterViewInit {
  readonly securityGroups$ = this.store.pipe(
    select(fromSecurityGroups.selectFilteredSecurityGroups),
  );
  readonly loading$ = this.store.pipe(select(fromSecurityGroups.isListLoading));
  readonly viewMode$ = this.store.pipe(select(fromSecurityGroups.viewMode));
  readonly query$ = this.store.pipe(select(fromSecurityGroups.query));
  readonly vmList$ = this.store.pipe(select(fromVM.selectEntities));

  constructor(private store: Store<State>, private cd: ChangeDetectorRef) {}

  public ngOnInit() {
    this.store.dispatch(new securityGroupActions.LoadSecurityGroupRequest());
    this.store.dispatch(new vmActions.LoadVMsRequest());
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
