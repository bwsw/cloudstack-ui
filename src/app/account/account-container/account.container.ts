import {
  Component,
  OnInit
} from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import * as accountActions from '../redux/accounts.actions';
import * as domainActions from '../../domains/redux/domains.actions';
import * as roleActions from '../../roles/redux/roles.actions';
import { FilterService } from '../../shared/services/filter.service';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import * as fromAccounts from '../redux/accounts.reducers';
import * as fromDomains from '../../domains/redux/domains.reducers';
import * as fromRoles from '../../roles/redux/roles.reducers';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { Account, AccountState } from '../../shared/models/account.model';

export const stateTranslations = {
  [AccountState.locked]: 'ACCOUNT_STATE.LOCKED',
  [AccountState.enabled]: 'ACCOUNT_STATE.ENABLED',
  [AccountState.disabled]: 'ACCOUNT_STATE.DISABLED',
};

@Component({
  selector: 'cs-account-page-container',
  template: `
    <cs-account-page
      [accounts]="accounts$ | async"
      [isLoading]="loading$ | async"
      [domains]="domains$ | async"
      [roles]="roles$ | async"
      [roleTypes]="roleTypes$ | async"
      [states]="states"
      [groupings]="groupings"
      [selectedDomainIds]="selectedDomainIds$ | async"
      [selectedRoleNames]="selectedRoleNames$ | async"
      [selectedRoleTypes]="selectedRoleTypes$ | async"
      [selectedStates]="selectedStates$ | async"
      [selectedGroupings]="selectedGroupings"
      (onDomainsChange)="onDomainsChange($event)"
      (onRolesChange)="onRolesChange($event)"
      (onRoleTypesChange)="onRoleTypesChange($event)"
      (onStatesChange)="onStatesChange($event)"
      (onAccountChanged)="onAccountChange($event)"
      (onGroupingsChange)="update($event)"
    ></cs-account-page>`
})
export class AccountPageContainerComponent extends WithUnsubscribe() implements OnInit {

  readonly accounts$ = this.store.select(fromAccounts.selectFilteredAccounts);
  readonly loading$ = this.store.select(fromAccounts.isLoading);
  readonly filters$ = this.store.select(fromAccounts.filters);
  readonly domains$ = this.store.select(fromDomains.domains);
  readonly roles$ = this.store.select(fromRoles.roles);
  readonly roleTypes$ = this.store.select(fromRoles.roleTypes);

  readonly selectedDomainIds$ = this.store.select(fromAccounts.filterSelectedDomainIds);
  readonly selectedRoleNames$ = this.store.select(fromAccounts.filterSelectedRoleNames);
  readonly selectedStates$ = this.store.select(fromAccounts.filterSelectedStates);
  readonly selectedRoleTypes$ = this.store.select(fromAccounts.filterSelectedRoleTypes);

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
    }
  ];
  public selectedGroupings = [];

  public states: Array<string> = ['enabled', 'disabled', 'locked'];

  private filterService = new FilterService(
    {
      'domains': { type: 'array', defaultOption: [] },
      'roles': { type: 'array', defaultOption: [] },
      'roleTypes': { type: 'array', defaultOption: [] },
      'states': { type: 'array', defaultOption: [] },
      'groupings': { type: 'array', defaultOption: [] }
    },
    this.router,
    this.sessionStorage,
    'accountListFilters',
    this.activatedRoute
  );

  constructor(
    private store: Store<State>,
    private sessionStorage: SessionStorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  public stateTranslation(state): string {
    return stateTranslations[state];
  }

  public onDomainsChange(selectedDomainIds) {
    this.store.dispatch(new accountActions.AccountFilterUpdate({ selectedDomainIds }));
  }

  public onRolesChange(selectedRoleNames) {
    this.store.dispatch(new accountActions.AccountFilterUpdate({ selectedRoleNames }));
  }

  public onRoleTypesChange(selectedRoleTypes) {
    this.store.dispatch(new accountActions.AccountFilterUpdate({ selectedRoleTypes }));
  }

  public onStatesChange(selectedStates) {
    this.store.dispatch(new accountActions.AccountFilterUpdate({ selectedStates }));
  }

  public onAccountChange(event) {
    this.store.dispatch(new accountActions.AccountFilterUpdate({}));
  }

  public ngOnInit() {
    this.store.dispatch(new domainActions.LoadDomainsRequest());
    this.store.dispatch(new roleActions.LoadRolesRequest());
    this.initFilters();
    this.filters$
      .takeUntil(this.unsubscribe$)
      .subscribe(filters => {
        this.filterService.update({
          'domains': filters.selectedDomainIds,
          'roles': filters.selectedRoleNames,
          'roleTypes': filters.selectedRoleTypes,
          'states': filters.selectedStates,
          'groupings': filters.selectedGroupingNames
        });
      });
  }

  public update(selectedGroupings) {
    this.selectedGroupings = selectedGroupings;
    const selectedGroupingNames = this.selectedGroupings.map(g => g.key);
    this.store.dispatch(new accountActions.AccountFilterUpdate({ selectedGroupingNames }));
  }

  private initFilters(): void {

    const params = this.filterService.getParams();
    const selectedDomainIds = params['domains'];
    const selectedRoleNames = params['roles'];
    const selectedStates = params['states'];
    const selectedRoleTypes = params['roleTypes'];

    this.selectedGroupings = params['groupings'].reduce((acc, _) => {
      const grouping = this.groupings.find(g => g.key === _);
      if (grouping) {
        acc.push(grouping);
      }
      return acc;
    }, []);

    const selectedGroupingNames = this.selectedGroupings.map(g => g.key);

    this.store.dispatch(new accountActions.AccountFilterUpdate({
      selectedRoleTypes,
      selectedRoleNames,
      selectedDomainIds,
      selectedStates,
      selectedGroupingNames
    }));

  }

}
