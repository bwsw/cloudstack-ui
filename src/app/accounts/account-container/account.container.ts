import { Component, OnInit } from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import * as accountEvent from '../redux/accounts.actions';
import * as domainEvent from '../../domains/redux/domains.actions';
import * as roleEvent from '../../roles/redux/roles.actions';
import { FilterService } from '../../shared/services/filter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import * as fromAccounts from '../redux/accounts.reducers';
import * as fromDomains from '../../domains/redux/domains.reducers'
import * as fromRoles from '../../roles/redux/roles.reducers'
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';

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
      [selectedDomainIds]="selectedDomainIds$ | async"
      [selectedRoleNames]="selectedRoleNames$ | async"
      [selectedRoleTypes]="selectedRoleTypes$ | async"
      [selectedStates]="selectedStates$ | async"
      (onDomainsChange)="onDomainsChange($event)"
      (onRolesChange)="onRolesChange($event)"
      (onRoleTypesChange)="onRoleTypesChange($event)"
      (onStatesChange)="onStatesChange($event)"
      (onAccountChanged)="onAccountChange($event)"
    ></cs-account-page>`
})
export class AccountPageContainerComponent extends WithUnsubscribe() implements OnInit {

  readonly accounts$ = this.store.select(fromAccounts.selectFilteredAccounts);
  readonly loading$ = this.store.select(fromAccounts.isLoading);
  readonly filters$ = this.store.select(fromAccounts.filters);
  readonly domains$ = this.store.select(fromDomains.list);
  readonly roles$ = this.store.select(fromRoles.list);
  readonly roleTypes$ = this.store.select(fromRoles.roleTypes);

  readonly selectedDomainIds$ = this.store.select(fromAccounts.filterSelectedDomainIds);
  readonly selectedRoleNames$ = this.store.select(fromAccounts.filterSelectedRoleNames);
  readonly selectedStates$ = this.store.select(fromAccounts.filterSelectedStates);
  readonly selectedRoleTypes$ = this.store.select(fromAccounts.filterSelectedRoleTypes);

  readonly states: Array<string> = ['enabled', 'disabled', 'locked'];

  private filterService = new FilterService(
    {
      'domains': { type: 'array', defaultOption: [] },
      'roles': { type: 'array', defaultOption: [] },
      'roleTypes': { type: 'array', defaultOption: [] },
      'states': { type: 'array', defaultOption: [] }
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



  public onDomainsChange(selectedDomainIds) {
    this.store.dispatch(new accountEvent.AccountFilterUpdate({ selectedDomainIds }));
  }
  public onRolesChange(selectedRoleNames) {
    this.store.dispatch(new accountEvent.AccountFilterUpdate({ selectedRoleNames }));
  }
  public onRoleTypesChange(selectedRoleTypes) {
    this.store.dispatch(new accountEvent.AccountFilterUpdate({ selectedRoleTypes }));
  }
  public onStatesChange(selectedStates) {
    this.store.dispatch(new accountEvent.AccountFilterUpdate({ selectedStates }));
  }

  public onAccountChange(event) {
    this.store.dispatch(new accountEvent.AccountFilterUpdate({ }));
  }

  public ngOnInit() {
    this.store.dispatch(new domainEvent.LoadDomainsRequest({}));
    this.store.dispatch(new roleEvent.LoadRolesRequest({}));
    this.initFilters();
    this.filters$
      .takeUntil(this.unsubscribe$)
      .subscribe(filters => {
        this.filterService.update({
          'domains': filters.selectedDomainIds,
          'roles': filters.selectedRoleNames,
          'roleTypes': filters.selectedRoleTypes,
          'states': filters.selectedStates
        });
      });
  }

  private initFilters(): void {

    const params = this.filterService.getParams();
    let selectedDomainIds = params['domains'];
    let selectedRoleNames = params['roles'];


    const selectedStates = params['states'];
    const selectedRoleTypes = params['roleTypes'];
    this.store.dispatch(new accountEvent.AccountFilterUpdate({
      selectedRoleTypes,
      selectedRoleNames,
      selectedDomainIds,
      selectedStates
    }));

  }

}
