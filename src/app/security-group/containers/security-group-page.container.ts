import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';

import * as fromSecurityGroups from '../../reducers/security-groups/redux/sg.reducers';
import * as securityGroupActions from '../../reducers/security-groups/redux/sg.actions';
import * as vmActions from '../../reducers/vm/redux/vm.actions';

@Component({
  selector: 'cs-security-group-page-container',
  template: `
    <cs-security-group-page
      [securityGroups]="securityGroups$ | async"
      [isLoading]="loading$ | async"
      [viewMode]="viewMode$ | async"
      [query]="query$ | async"
    ></cs-security-group-page>
  `
})
export class SecurityGroupPageContainerComponent implements OnInit, AfterViewInit {
  readonly securityGroups$ = this.store.select(fromSecurityGroups.selectFilteredSecurityGroups);
  readonly loading$ = this.store.select(fromSecurityGroups.isListLoading);
  readonly viewMode$ = this.store.select(fromSecurityGroups.viewMode);
  readonly query$ = this.store.select(fromSecurityGroups.query);

  constructor(
    private store: Store<State>,
    private cd: ChangeDetectorRef
  ) {
  }

  public ngOnInit() {
    this.store.dispatch(new securityGroupActions.LoadSGRequest());
    this.store.dispatch(new vmActions.LoadVMRequest());
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
