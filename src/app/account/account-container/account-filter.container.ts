import { Component, Input, OnInit } from '@angular/core';
import * as accountActions from '../../reducers/accounts/redux/accounts.actions';
import * as domainActions from '../../reducers/domains/redux/domains.actions';
import * as roleActions from '../../reducers/roles/redux/roles.actions';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import * as fromDomains from '../../reducers/domains/redux/domains.reducers';
import * as fromRoles from '../../reducers/roles/redux/roles.reducers';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import { FilterService } from '../../shared/services/filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';

const FILTER_KEY = 'accountListFilters';

@Component({
  selector: 'cs-account-filter-container',
  template: `
    <cs-account-list-filter
      *loading="loading$ | async"
      [domains]="domains$ | async"
      [roles]="roles$ | async"
      [roleTypes]="roleTypes$ | async"
      [states]="states"
      [selectedDomainIds]="selectedDomainIds$ | async"
      [selectedRoleNames]="selectedRoleNames$ | async"
      [selectedRoleTypes]="selectedRoleTypes$ | async"
      [selectedStates]="selectedStates$ | async"
      [groupings]="groupings"
      [selectedGroupings]="selectedGroupings"
      (onDomainsChange)="onDomainsChange($event)"
      (onRolesChange)="onRolesChange($event)"
      (onRoleTypesChange)="onRoleTypesChange($event)"
      (onStatesChange)="onStatesChange($event)"
      (onGroupingsChange)="onGroupingsChange($event)"
    ></cs-account-list-filter>`
})
export class AccountFilterContainerComponent extends WithUnsubscribe() implements OnInit {
  @Input() groupings: Array<any>;
  @Input() selectedGroupings: Array<any>;

  readonly filters$ = this.store.select(fromAccounts.filters);
  readonly loading$ = this.store.select(fromAccounts.isLoading);
  readonly domains$ = this.store.select(fromDomains.selectAll);
  readonly roles$ = this.store.select(fromRoles.selectAll);
  readonly roleTypes$ = this.store.select(fromRoles.roleTypes);

  readonly selectedDomainIds$ = this.store.select(fromAccounts.filterSelectedDomainIds);
  readonly selectedRoleNames$ = this.store.select(fromAccounts.filterSelectedRoleNames);
  readonly selectedStates$ = this.store.select(fromAccounts.filterSelectedStates);
  readonly selectedRoleTypes$ = this.store.select(fromAccounts.filterSelectedRoleTypes);

  public states: Array<string> = ['enabled', 'disabled'];

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
    FILTER_KEY,
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

  public onGroupingsChange(selectedGroupings) {
    this.store.dispatch(new accountActions.AccountFilterUpdate({ selectedGroupings }));
  }

  private initFilters(): void {

    const params = this.filterService.getParams();
    const selectedDomainIds = params['domains'];
    const selectedRoleNames = params['roles'];
    const selectedStates = params['states'];
    const selectedRoleTypes = params['roleTypes'];

    const selectedGroupings = params['groupings'].reduce((acc, _) => {
      const grouping = this.groupings.find(g => g.key === _);
      if (grouping) {
        acc.push(grouping);
      }
      return acc;
    }, []);

    this.store.dispatch(new accountActions.AccountFilterUpdate({
      selectedRoleTypes,
      selectedRoleNames,
      selectedDomainIds,
      selectedStates,
      selectedGroupings
    }));

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
          'groupings': filters.selectedGroupings.map(g => g.key)
        });
      });
  }

}
