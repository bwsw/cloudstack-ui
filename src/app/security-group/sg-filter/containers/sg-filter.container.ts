import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { FilterService } from '../../../shared/services/filter.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { WithUnsubscribe } from '../../../utils/mixins/with-unsubscribe';
import { Store } from '@ngrx/store';
import { State } from '../../../reducers/index';

import * as  securityGroupActions from '../../../reducers/security-groups/redux/sg.actions';
import * as  fromSecurityGroups from '../../../reducers/security-groups/redux/sg.reducers';
import * as fromAccounts from '../../../reducers/accounts/redux/accounts.reducers';
import * as accountActions from '../../../reducers/accounts/redux/accounts.actions';

export enum SecurityGroupViewMode {
  Templates = 'templates',
  Shared = 'shared'
}

@Component({
  selector: 'cs-sg-filter-container',
  templateUrl: 'sg-filter.container.html',
})
export class SgFilterContainerComponent extends WithUnsubscribe() implements OnInit {
  public filters$ = this.store.select(fromSecurityGroups.filters);
  readonly accounts$ = this.store.select(fromAccounts.selectAll);
  public viewMode: SecurityGroupViewMode;

  public query: string;

  private filtersKey = 'securityGroupFilters';
  private filterService = new FilterService(
    {
      viewMode: {
        type: 'string',
        options: [SecurityGroupViewMode.Templates, SecurityGroupViewMode.Shared]
      },
      query: {
        type: 'string'
      },
      accounts: { type: 'array', defaultOption: [] }
    },
    this.router,
    this.storageService,
    this.filtersKey,
    this.activatedRoute
  );

  constructor(
    private store: Store<State>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private storageService: LocalStorageService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.store.dispatch(new accountActions.LoadAccountsRequest());
    this.initFilters();
  }

  public get mode(): number {
    const modeIndices = {
      [SecurityGroupViewMode.Templates]: 0,
      [SecurityGroupViewMode.Shared]: 1
    };

    return modeIndices[this.viewMode] || 0;
  }

  public initFilters(): void {
    const params = this.filterService.getParams();
    const viewMode = params.viewMode || SecurityGroupViewMode.Templates;
    const query = params.query;
    const selectedAccountIds = params.accounts;

    this.store.dispatch(new securityGroupActions.SecurityGroupFilterUpdate({
      viewMode,
      query,
      selectedAccountIds
    }));

    this.filters$
      .takeUntil(this.unsubscribe$)
      .subscribe(filters => this.filterService.update({
        viewMode: filters.viewMode,
        query: filters.query,
        accounts: filters.selectedAccountIds
      }));
  }

  public onViewModeChange(viewMode) {
    this.store.dispatch(new securityGroupActions.SecurityGroupFilterUpdate({ viewMode }));
  }

  public onAccountsChange(selectedAccountIds) {
    this.store.dispatch(new securityGroupActions.SecurityGroupFilterUpdate({ selectedAccountIds }))
  }

  public onQueryChange(query) {
    this.store.dispatch(new securityGroupActions.SecurityGroupFilterUpdate({ query }));
  }
}
