import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import { State } from '../../reducers/index';
import { Account, accountState, getPath } from '../../shared/models';
import { AuthService } from '../../shared/services/auth.service';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import * as domainActions from '../../reducers/domains/redux/domains.actions';
import * as fromDomains from '../../reducers/domains/redux/domains.reducers';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

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
    ></cs-account-page>
  `,
})
export class AccountPageContainerComponent extends WithUnsubscribe()
  implements OnInit, AfterViewInit {
  readonly accounts$ = combineLatest([
    this.store.pipe(select(fromAccounts.selectFilteredAccounts)),
    this.store.pipe(select(fromDomains.selectEntities)),
  ]).pipe(
    map(([accounts, domains]) =>
      accounts.map(account => {
        const domain = domains[account.domainid];

        return {
          ...account,
          domainpath: (domain && getPath(domain)) || '',
        };
      }),
    ),
  );
  readonly loading$ = this.store.pipe(select(fromAccounts.isLoading));
  readonly selectedGroupings$ = this.store.pipe(select(fromAccounts.filterSelectedGroupings));

  public groupings = [
    {
      key: 'domains',
      label: 'ACCOUNT_PAGE.FILTERS.GROUP_BY_DOMAINS',
      selector: (item: Account) => item.domainid,
      name: (item: Account) => item.domainpath || '',
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

  public ngOnInit() {
    this.store.dispatch(new domainActions.LoadDomainsRequest());
  }

  public stateTranslation(state): string {
    return stateTranslations[state];
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
