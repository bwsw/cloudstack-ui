import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { State } from '../../reducers/index';
import { select, Store } from '@ngrx/store';
import * as accountActions from '../../reducers/accounts/redux/accounts.actions';

import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { AuthService } from '../../shared/services/auth.service';
import { Account, accountState } from '../../shared/models/account.model';

export const stateTranslations = {
  [accountState.disabled]: 'ACCOUNT_STATE.DISABLED',
  [accountState.enabled]: 'ACCOUNT_STATE.ENABLED',
};

@Component({
  selector: 'cs-account-page-container',
  template: `
    <cs-account-page
      [accounts]="accounts$ | async"
      [isLoading]="loading$ | async"
      [groupings]="groupings"
      [selectedGroupings]="selectedGroupings$ | async"
    ></cs-account-page>`,
})
export class AccountPageContainerComponent extends WithUnsubscribe()
  implements OnInit, AfterViewInit {
  readonly accounts$ = this.store.pipe(select(fromAccounts.selectFilteredAccounts));
  readonly loading$ = this.store.pipe(select(fromAccounts.isLoading));
  readonly selectedGroupings$ = this.store.pipe(select(fromAccounts.filterSelectedGroupings));

  public groupings = [
    {
      key: 'domains',
      label: 'ACCOUNT_PAGE.FILTERS.GROUP_BY_DOMAINS',
      selector: (item: Account) => item.domainid,
      name: (item: Account) => item.domain,
    },
    {
      key: 'roles',
      label: 'ACCOUNT_PAGE.FILTERS.GROUP_BY_ROLES',
      selector: (item: Account) => item.roleid,
      name: (item: Account) => item.rolename,
    },
    {
      key: 'roletypes',
      label: 'ACCOUNT_PAGE.FILTERS.GROUP_BY_ROLETYPES',
      selector: (item: Account) => item.roletype,
      name: (item: Account) => item.roletype,
    },
    {
      key: 'states',
      label: 'ACCOUNT_PAGE.FILTERS.GROUP_BY_STATES',
      selector: (item: Account) => item.state,
      name: (item: Account) => this.stateTranslation(item.state),
    },
  ];

  constructor(
    private store: Store<State>,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }

  public stateTranslation(state): string {
    return stateTranslations[state];
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }

  public ngOnInit() {
    this.store.dispatch(new accountActions.LoadAccountsRequest());
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
