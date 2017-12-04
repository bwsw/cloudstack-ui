import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import * as fromVMs from '../../reducers/vm/redux/vm.reducers';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import * as fromZones from '../../reducers/zones/redux/zones.reducers';
import * as vmActions from '../../reducers/vm/redux/vm.actions';
import * as accountActions from '../../reducers/accounts/redux/accounts.actions';
import * as zoneActions from '../../reducers/zones/redux/zones.actions';
import { FilterService } from '../../shared/services/filter.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { VmState } from '../shared/vm.model';
import { AuthService } from '../../shared/services/auth.service';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import * as debounce from 'lodash/debounce';


@Component({
  selector: 'cs-vm-filter-container',
  template: `
    <cs-vm-filter
      *loading="loading$ | async"
      [zones]="zones$ | async"
      [accounts]="accounts$ | async"
      [groups]="groups$ | async"
      [states]="states"
      [groupings]="groupings"
      [query]="query$ | async"
      [selectedGroupings]="selectedGroupings"
      [selectedZoneIds]="selectedZoneIds$ | async"
      [selectedGroupNames]="selectedGroupNames$ | async"
      [selectedAccountIds]="selectedAccountIds$ | async"
      [selectedStates]="selectedStates$ | async"
      (onQueryChange)="onQueryChange($event)"
      (onZonesChange)="onZonesChange($event)"
      (onGroupNamesChange)="onGroupNamesChange($event)"
      (onAccountsChange)="onAccountsChange($event)"
      (onStatesChange)="onStatesChange($event)"
      (onGroupingsChange)="onGroupingsChange($event)"
    ></cs-vm-filter>`
})
export class VMFilterContainerComponent extends WithUnsubscribe() implements OnInit, AfterViewInit {

  @Input() groupings: Array<any>;
  @Input() selectedGroupings: Array<any>;

  readonly filters$ = this.store.select(fromVMs.filters);
  readonly query$ = this.store.select(fromVMs.filterQuery);
  readonly zones$ = this.store.select(fromZones.selectAll);
  readonly accounts$ = this.store.select(fromAccounts.selectAll);
  readonly groups$ = this.store.select(fromVMs.selectVmGroups);
  readonly loading$ = this.store.select(fromVMs.isLoading);

  readonly selectedZoneIds$ = this.store.select(fromVMs.filterSelectedZoneIds);
  readonly selectedGroupNames$ = this.store.select(fromVMs.filterSelectedGroupNames);
  readonly selectedAccountIds$ = this.store.select(fromVMs.filterSelectedAccountIds);
  readonly selectedStates$ = this.store.select(fromVMs.filterSelectedStates);

  public states = [
    {
      state: VmState.Running,
      name: 'VM_PAGE.FILTERS.STATE_RUNNING'
    },
    {
      state: VmState.Stopped,
      name: 'VM_PAGE.FILTERS.STATE_STOPPED'
    },
    {
      state: VmState.Destroyed,
      name: 'VM_PAGE.FILTERS.STATE_DESTROYED',
      access: this.authService.allowedToViewDestroyedVms()
    },
    {
      state: VmState.Error,
      name: 'VM_PAGE.FILTERS.STATE_ERROR'
    }
  ].filter(state => !state.hasOwnProperty('access') || state['access']);

  private filtersKey = 'vmListFilters';
  private filterService = new FilterService({
    zones: { type: 'array', defaultOption: [] },
    groups: { type: 'array', defaultOption: [] },
    groupings: { type: 'array', defaultOption: [] },
    query: { type: 'string' },
    states: { type: 'array', options: this.states.map(_ => _.state), defaultOption: [] },
    accounts: {type: 'array', defaultOption: [] }
  }, this.router, this.sessionStorage, this.filtersKey, this.activatedRoute);

  constructor(
    private cd: ChangeDetectorRef,
    private store: Store<State>,
    private sessionStorage: SessionStorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    super();
    this.onQueryChange = debounce(this.onQueryChange.bind(this), 500);
  }

  public onQueryChange(query) {
    this.store.dispatch(new vmActions.VMFilterUpdate({ query }));
  }

  public onZonesChange(selectedZoneIds) {
    this.store.dispatch(new vmActions.VMFilterUpdate({ selectedZoneIds }));
  }

  public onAccountsChange(selectedAccountIds) {
    this.store.dispatch(new vmActions.VMFilterUpdate({ selectedAccountIds }))
  }

  public onGroupNamesChange(selectedGroupNames) {
    this.store.dispatch(new vmActions.VMFilterUpdate({ selectedGroupNames }));
  }

  public onStatesChange(selectedStates) {
    this.store.dispatch(new vmActions.VMFilterUpdate({ selectedStates }));
  }

  public onGroupingsChange(selectedGroupings) {
    this.store.dispatch(new vmActions.VMFilterUpdate({ selectedGroupings }));
  }

  private initFilters(): void {

    const params = this.filterService.getParams();

    const selectedGroupNames = params['groups'];
    const selectedStates = params['states'];

    const selectedZoneIds = params['zones'];
    const query = params.query;

    const selectedGroupings = params['groupings'].reduce((acc, _) => {
      const grouping = this.groupings.find(g => g.key === _);
      if (grouping) {
        acc.push(grouping);
      }
      return acc;
    }, []);

    const selectedAccountIds = params['accounts'];

    this.store.dispatch(new vmActions.VMFilterUpdate({
      query,
      selectedStates,
      selectedGroupNames,
      selectedZoneIds,
      selectedAccountIds,
      selectedGroupings
    }));

  }

  public ngOnInit() {
    this.store.dispatch(new zoneActions.LoadZonesRequest());
    this.store.dispatch(new accountActions.LoadAccountsRequest());
    this.initFilters();
    this.filters$
      .takeUntil(this.unsubscribe$)
      .subscribe(filters => {
        this.filterService.update({
          zones: filters.selectedZoneIds,
          groups: filters.selectedGroupNames,
          states: filters.selectedStates,
          groupings: filters.selectedGroupings.map(_ => _.key),
          query: filters.query,
          accounts: filters.selectedAccountIds
        });
      });
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
}
