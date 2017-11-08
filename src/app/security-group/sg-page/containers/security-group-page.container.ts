import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { State } from '../../../reducers/index';
import { Store } from '@ngrx/store';

import * as fromSecurityGroups from '../../../reducers/security-groups/redux/sg.reducers';
import * as securityGroupActions from '../../../reducers/security-groups/redux/sg.actions';

@Component({
  selector: 'cs-security-group-page-container',
  templateUrl: 'security-group-page.container.html',
})
export class SecurityGroupPageContainerComponent implements OnInit, AfterViewInit {
  public securityGroups$ = this.store.select(fromSecurityGroups.selectFilteredSecurityGroups);
  public loading$ = this.store.select(fromSecurityGroups.isListLoading);
  public viewMode$ = this.store.select(fromSecurityGroups.viewMode);

  constructor(private store: Store<State>, private cd: ChangeDetectorRef) {
  }

  public ngOnInit() {
    this.store.dispatch(new securityGroupActions.LoadSGRequest());
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
