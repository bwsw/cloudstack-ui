import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';

import { FilterService } from '../../../shared/services/filter.service';
import { WithUnsubscribe } from '../../../utils/mixins/with-unsubscribe';
import { State } from '../../../reducers';

import * as securityGroupActions from '../../../reducers/security-groups/redux/sg.actions';
import * as fromSecurityGroups from '../../../reducers/security-groups/redux/sg.reducers';
import * as fromAccounts from '../../../reducers/accounts/redux/accounts.reducers';
import { SecurityGroupViewMode } from '../../sg-view-mode';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
import { NavbarService, SearchBoxState } from '../../../core/services/navbar.service';

const FILTER_KEY = 'securityGroupFilters';

@Component({
  selector: 'cs-sg-filter-container',
  templateUrl: 'sg-filter.container.html',
})
export class SgFilterContainerComponent extends WithUnsubscribe() implements OnInit {
  public filters$ = this.store.pipe(select(fromSecurityGroups.filters));
  readonly accounts$ = this.store.pipe(select(fromAccounts.selectAll));
  public viewMode: SecurityGroupViewMode;

  public query: string;
  public searchBoxState: SearchBoxState;

  private filterService = new FilterService(
    {
      viewMode: {
        type: 'string',
        options: [
          SecurityGroupViewMode.Templates,
          SecurityGroupViewMode.Shared,
          SecurityGroupViewMode.Private,
        ],
        defaultOption: SecurityGroupViewMode.Templates,
      },
      query: {
        type: 'string',
      },
      accounts: { type: 'array', defaultOption: [] },
    },
    this.router,
    this.sessionStorage,
    FILTER_KEY,
    this.activatedRoute,
  );

  constructor(
    private store: Store<State>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sessionStorage: SessionStorageService,
    private navbar: NavbarService,
  ) {
    super();

    this.searchBoxState = {
      showSearchBox: true,
      event: this.onQueryChange.bind(this),
      placeholder: 'SECURITY_GROUP_PAGE.FILTERS.SEARCH',
      query: '',
    };
    this.filters$.pipe(takeUntil(this.unsubscribe$)).subscribe(filters => {
      this.searchBoxState.query = filters.query;
    });
    navbar.bindSearchBox(this.searchBoxState, this.unsubscribe$);
  }

  public ngOnInit(): void {
    this.initFilters();
  }

  public initFilters(): void {
    const params = this.filterService.getParams();
    const viewMode = params.viewMode || SecurityGroupViewMode.Templates;
    const query = params.query;
    const selectedAccountIds = params.accounts;

    this.store.dispatch(
      new securityGroupActions.SecurityGroupFilterUpdate({
        viewMode,
        query,
        selectedAccountIds,
      }),
    );

    this.filters$.pipe(takeUntil(this.unsubscribe$)).subscribe(filters =>
      this.filterService.update({
        viewMode: filters.viewMode,
        query: filters.query,
        accounts: filters.selectedAccountIds,
        orphan: filters.selectOrphanSG,
      }),
    );
  }

  public onViewModeChange(viewMode) {
    this.store.dispatch(new securityGroupActions.SecurityGroupFilterUpdate({ viewMode }));
  }

  public onAccountsChange(selectedAccountIds) {
    this.store.dispatch(new securityGroupActions.SecurityGroupFilterUpdate({ selectedAccountIds }));
  }

  public onQueryChange(query) {
    this.store.dispatch(new securityGroupActions.SecurityGroupFilterUpdate({ query }));
  }

  public onOrphanChange(selectOrphanSG) {
    this.store.dispatch(new securityGroupActions.SecurityGroupFilterUpdate({ selectOrphanSG }));
  }
}
