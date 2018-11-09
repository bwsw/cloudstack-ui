import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

import { State } from '../../../reducers';
import { Snapshot, SnapshotType } from '../../../shared/models';
import { AuthService } from '../../../shared/services/auth.service';
import { FilterService } from '../../../shared/services/filter.service';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
import { WithUnsubscribe } from '../../../utils/mixins/with-unsubscribe';
import { UserTagsSelectors } from '../../../root-store';

import * as accountActions from '../../../reducers/accounts/redux/accounts.actions';
import * as fromAccounts from '../../../reducers/accounts/redux/accounts.reducers';
import * as fromSnapshots from '../../../reducers/snapshots/redux/snapshot.reducers';
import * as snapshotActions from '../../../reducers/snapshots/redux/snapshot.actions';
import * as zoneActions from '../../../reducers/zones/redux/zones.actions';

const getGroupName = (snapshot: Snapshot) => {
  return snapshot.domain !== 'ROOT' ? `${snapshot.domain}/${snapshot.account}` : snapshot.account;
};

const FILTER_KEY = 'snapshotFilters';

@Component({
  selector: 'cs-snapshots-filter-container',
  template: `
    <cs-snapshots-filter
      [accounts]="accounts$ | async"
      [types]="types"
      [availableGroupings]="groupings"
      [isLoading]="isLoading$ | async"
      [firstDayOfWeek]="firstDayOfWeek | async"
      [selectedAccounts]="selectedAccounts$ | async"
      [selectedTypes]="selectedTypes$ | async"
      [selectedDate]="selectedDate$ | async"
      [selectedGroupings]="selectedGroupings$ | async"
      [query]="query$ | async"
      (selectedAccountsChange)="onAccountsChange($event)"
      (selectedTypesChange)="onTypesChange($event)"
      (selectedDateChange)="onDateChange($event)"
      (selectedGroupingsChange)="onGroupingsChange($event)"
      (queryChange)="onQueryChange($event)"
    ></cs-snapshots-filter>`,
})
export class SnapshotFilterContainerComponent extends WithUnsubscribe() implements OnInit {
  readonly filters$ = this.store.pipe(select(fromSnapshots.filters));
  readonly selectedAccounts$ = this.store.pipe(select(fromSnapshots.filterSelectedAccounts));
  readonly selectedTypes$ = this.store.pipe(select(fromSnapshots.filterSelectedTypes));
  readonly selectedDate$ = this.store.pipe(select(fromSnapshots.filterSelectedDate));
  readonly selectedGroupings$ = this.store.pipe(select(fromSnapshots.filterSelectedGroupings));
  readonly query$ = this.store.pipe(select(fromSnapshots.filterQuery));
  readonly accounts$ = this.store.pipe(select(fromAccounts.selectAll));
  readonly isLoading$ = this.store.pipe(select(fromSnapshots.isLoading));
  readonly firstDayOfWeek = this.store.pipe(select(UserTagsSelectors.getFirstDayOfWeek));

  public types = [
    {
      type: SnapshotType.Manual,
      name: 'SNAPSHOT_PAGE.TYPES.MANUAL',
    },
    {
      type: SnapshotType.Hourly,
      name: 'SNAPSHOT_PAGE.TYPES.HOURLY',
    },
    {
      type: SnapshotType.Daily,
      name: 'SNAPSHOT_PAGE.TYPES.DAILY',
    },
    {
      type: SnapshotType.Weekly,
      name: 'SNAPSHOT_PAGE.TYPES.WEEKLY',
    },
    {
      type: SnapshotType.Monthly,
      name: 'SNAPSHOT_PAGE.TYPES.MONTHLY',
    },
  ];

  public groupings = [
    {
      key: 'accounts',
      label: 'SNAPSHOT_PAGE.FILTERS.GROUP_BY_ACCOUNTS',
      selector: (item: Snapshot) => item.account,
      name: getGroupName,
      hidden: () => !this.authService.isAdmin(),
    },
    {
      key: 'types',
      label: 'SNAPSHOT_PAGE.FILTERS.GROUP_BY_TYPES',
      selector: (item: Snapshot) => item.snapshottype,
      name: (item: Snapshot) => `SNAPSHOT_PAGE.TYPES.${item.snapshottype}`,
      hidden: () => false,
    },
  ];

  private filterService = new FilterService(
    {
      accounts: { type: 'array', defaultOption: [] },
      types: { type: 'array', defaultOption: [] },
      date: { type: 'string', defaultOption: moment().toString() },
      groupings: { type: 'array', defaultOption: [] },
      query: { type: 'string' },
    },
    this.router,
    this.storage,
    FILTER_KEY,
    this.activatedRoute,
  );

  constructor(
    private store: Store<State>,
    private router: Router,
    private storage: SessionStorageService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
  ) {
    super();
  }

  public ngOnInit() {
    this.store.dispatch(new zoneActions.LoadZonesRequest());
    this.store.dispatch(new accountActions.LoadAccountsRequest());
    this.initFilters();
    this.filters$.pipe(takeUntil(this.unsubscribe$)).subscribe(filters => {
      this.filterService.update({
        accounts: filters.selectedAccounts,
        types: filters.selectedTypes,
        date: moment(filters.selectedDate).format('YYYY-MM-DD'),
        groupings: filters.selectedGroupings.map(_ => _.key),
        query: filters.query,
      });
    });
  }

  public onAccountsChange(selectedAccounts) {
    this.store.dispatch(new snapshotActions.SnapshotFilterUpdate({ selectedAccounts }));
  }

  public onTypesChange(selectedTypes) {
    this.store.dispatch(new snapshotActions.SnapshotFilterUpdate({ selectedTypes }));
  }

  public onDateChange(selectedDate) {
    this.store.dispatch(new snapshotActions.SnapshotFilterUpdate({ selectedDate }));
  }

  public onGroupingsChange(selectedGroupings) {
    this.store.dispatch(new snapshotActions.SnapshotFilterUpdate({ selectedGroupings }));
  }

  public onQueryChange(query) {
    this.store.dispatch(new snapshotActions.SnapshotFilterUpdate({ query }));
  }

  private initFilters(): void {
    const params = this.filterService.getParams();
    const selectedAccounts = params['accounts'];
    const selectedTypes = params['types'];
    const selectedDate = params['date'];
    const selectedGroupings = params['groupings'].reduce((acc, _) => {
      const grouping = this.groupings.find(g => g.key === _);
      if (grouping) {
        acc.push(grouping);
      }
      return acc;
    }, []);
    const query = params.query;

    this.store.dispatch(
      new snapshotActions.SnapshotFilterUpdate({
        selectedAccounts,
        selectedTypes,
        selectedDate,
        selectedGroupings,
        query,
      }),
    );
  }
}
