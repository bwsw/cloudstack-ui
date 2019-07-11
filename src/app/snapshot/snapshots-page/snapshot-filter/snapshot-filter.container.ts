import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as moment from 'moment';
import { combineLatest } from 'rxjs';

import * as fromAccounts from '../../../reducers/accounts/redux/accounts.reducers';
import * as fromSnapshots from '../../../reducers/snapshots/redux/snapshot.reducers';
import * as fromVm from '../../../reducers/vm/redux/vm.reducers';
import * as fromVolumes from '../../../reducers/volumes/redux/volumes.reducers';
import * as zoneActions from '../../../reducers/zones/redux/zones.actions';
import { State, UserTagsSelectors } from '../../../root-store';

import { Snapshot, SnapshotType } from '../../../shared/models';
import { AuthService } from '../../../shared/services/auth.service';
import { FilterService } from '../../../shared/services/filter.service';
import { SessionStorageService } from '../../../shared/services/session-storage.service';
import { WithUnsubscribe } from '../../../utils/mixins/with-unsubscribe';
import { VmSnapshotViewModel } from '../../models/vm-snapshot.view-model';
import { snapshotPageActions, snapshotPageSelectors } from '../../store';
import { SnapshotPageViewMode } from '../../types';
import { takeUntil } from 'rxjs/operators';
import { NavbarService, SearchBoxState } from '../../../core/services/navbar.service';

const getGroupName = (snapshot: Snapshot | VmSnapshotViewModel) => {
  return snapshot.domain !== 'ROOT' ? `${snapshot.domain}/${snapshot.account}` : snapshot.account;
};

const FILTER_KEY = 'snapshotFilters';

@Component({
  selector: 'cs-snapshots-filter-container',
  template: `
    <ng-container *ngIf="viewMode === snapshotPageViewMode.Volume">
      <cs-volume-snapshots-filter
        [viewMode]="viewMode$ | async"
        [accounts]="accounts$ | async"
        [vms]="vmsWithSnapshots$ | async"
        [types]="types"
        [availableGroupings]="groupings"
        [isLoading]="isLoading$ | async"
        [firstDayOfWeek]="firstDayOfWeek$ | async"
        [selectedAccounts]="(filters$ | async).accounts"
        [selectedVms]="(filters$ | async).volumeVmIds"
        [selectedTypes]="(filters$ | async).volumeSnapshotTypes"
        [selectedDate]="(filters$ | async).date"
        [selectedGroupings]="selectedGroupings$ | async"
        (selectedAccountsChange)="onAccountsChange($event)"
        (selectedVolumeVmsChange)="onSelectedVolumeVmsChange($event)"
        (selectedTypesChange)="onTypesChange($event)"
        (selectedDateChange)="onDateChange($event)"
        (selectedGroupingsChange)="onGroupingsChange($event)"
        (viewModeChange)="onViewModeChange($event)"
      ></cs-volume-snapshots-filter>
    </ng-container>

    <ng-container *ngIf="viewMode === snapshotPageViewMode.VM">
      <cs-vm-snapshots-filter
        [viewMode]="viewMode$ | async"
        [accounts]="accounts$ | async"
        [vms]="vms$ | async"
        [isLoading]="isLoading$ | async"
        [firstDayOfWeek]="firstDayOfWeek$ | async"
        [selectedAccounts]="(filters$ | async).accounts"
        [selectedVms]="(filters$ | async).vmIds"
        [selectedDate]="(filters$ | async).date"
        (selectedAccountsChange)="onAccountsChange($event)"
        (selectedVmsChange)="onSelectedVmsChange($event)"
        (selectedDateChange)="onDateChange($event)"
        (viewModeChange)="onViewModeChange($event)"
      ></cs-vm-snapshots-filter>
    </ng-container>
  `,
})
export class SnapshotFilterContainerComponent extends WithUnsubscribe() implements OnInit {
  readonly filters$ = this.store.pipe(select(snapshotPageSelectors.getFilters));
  readonly vms$ = this.store.pipe(select(fromVm.selectAll));
  readonly vmsWithSnapshots$ = this.store.pipe(select(fromVolumes.selectVmWithVolumeSnapshot));
  readonly selectedGroupings$ = this.store.pipe(select(snapshotPageSelectors.getGroupings));
  readonly accounts$ = this.store.pipe(select(fromAccounts.selectAll));
  readonly isLoading$ = this.store.pipe(select(fromSnapshots.isLoading));
  readonly firstDayOfWeek$ = this.store.pipe(select(UserTagsSelectors.getFirstDayOfWeek));
  readonly viewMode$ = this.store.pipe(select(snapshotPageSelectors.getViewMode));

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
      selector: (item: Snapshot | VmSnapshotViewModel) => item.account,
      name: getGroupName,
      enabled: () => !this.authService.isAdmin(),
    },
    {
      key: 'types',
      label: 'SNAPSHOT_PAGE.FILTERS.GROUP_BY_TYPES',
      selector: (item: Snapshot) => item.snapshottype,
      name: (item: Snapshot) => item.snapshottype && `SNAPSHOT_PAGE.TYPES.${item.snapshottype}`,
      enabled: () => this.viewMode !== SnapshotPageViewMode.Volume,
    },
    {
      key: 'vms',
      label: 'SNAPSHOT_PAGE.FILTERS.GROUP_BY_VMS',
      selector: (item: VmSnapshotViewModel) => item.vmName,
      name: (item: VmSnapshotViewModel) => item.vmName,
      enabled: () => this.viewMode !== SnapshotPageViewMode.VM,
    },
  ];

  public snapshotPageViewMode = SnapshotPageViewMode;
  public viewMode: SnapshotPageViewMode;
  public searchBoxState: SearchBoxState;

  private filterService = new FilterService(
    {
      viewMode: {
        type: 'string',
        options: [SnapshotPageViewMode.Volume, SnapshotPageViewMode.VM],
        defaultOption: SnapshotPageViewMode.Volume,
      },
      accounts: { type: 'array', defaultOption: [] },
      types: { type: 'array', defaultOption: [] },
      vms: { type: 'array', defaultOption: [] },
      volumeVmIds: { type: 'array', defaultOption: [] },
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
    private navbar: NavbarService,
  ) {
    super();

    this.searchBoxState = {
      showSearchBox: true,
      event: this.onQueryChange.bind(this),
      placeholder: 'SNAPSHOT_PAGE.FILTERS.SEARCH',
      query: '',
    };
    this.filters$.pipe(takeUntil(this.unsubscribe$)).subscribe(filters => {
      this.searchBoxState.query = filters.query;
    });
    navbar.bindSearchBox(this.searchBoxState, this.unsubscribe$);
  }

  public ngOnInit() {
    this.store.dispatch(new zoneActions.LoadZonesRequest());
    this.initFilters();

    this.viewMode$.subscribe(mode => {
      this.viewMode = mode;
      switch (mode) {
        case SnapshotPageViewMode.Volume:
          this.searchBoxState.showSearchBox = true;
          break;
        case SnapshotPageViewMode.VM:
        default:
          this.searchBoxState.showSearchBox = false;
      }
    });

    combineLatest(
      this.filters$,
      this.store.pipe(select(snapshotPageSelectors.getViewMode)),
      this.store.pipe(select(snapshotPageSelectors.getGroupings)),
    ).subscribe(([filters, viewMode, groupings]) => {
      this.filterService.update({
        viewMode,
        accounts: filters.accounts,
        types: filters.volumeSnapshotTypes,
        vms: filters.vmIds,
        volumeVmIds: filters.volumeVmIds,

        date: moment(filters.date).format('YYYY-MM-DD'),
        query: filters.query,
        groupings: groupings.map(grouping => grouping.key),
      });
    });
  }

  public onAccountsChange(selectedAccounts) {
    this.store.dispatch(new snapshotPageActions.UpdateFilters({ accounts: selectedAccounts }));
  }

  public onSelectedVmsChange(vmIds: string[]) {
    this.store.dispatch(new snapshotPageActions.UpdateFilters({ vmIds }));
  }

  public onSelectedVolumeVmsChange(volumeVmIds: string[]): void {
    this.store.dispatch(new snapshotPageActions.UpdateFilters({ volumeVmIds }));
  }

  public onTypesChange(selectedTypes) {
    this.store.dispatch(
      new snapshotPageActions.UpdateFilters({ volumeSnapshotTypes: selectedTypes }),
    );
  }

  public onDateChange(selectedDate) {
    this.store.dispatch(new snapshotPageActions.UpdateFilters({ date: selectedDate }));
  }

  public onGroupingsChange(selectedGroupings) {
    this.store.dispatch(new snapshotPageActions.UpdateGroupings({ groupings: selectedGroupings }));
  }

  public onQueryChange(query) {
    this.store.dispatch(new snapshotPageActions.UpdateFilters({ query }));
  }

  public onViewModeChange(mode: SnapshotPageViewMode) {
    this.store.dispatch(new snapshotPageActions.UpdateViewMode({ mode }));
  }

  private initFilters(): void {
    const params = this.filterService.getParams();
    const mode = params['viewMode'];
    const accounts = params['accounts'];
    const vms = params['vms'];
    const volumeSnapshotTypes = params['types'];
    const volumeVmIds = params['volumeVmIds'];
    const date = moment(params['date']).toDate();
    const groupings = params['groupings'].reduce((acc, _) => {
      const grouping = this.groupings.find(g => g.key === _);
      if (grouping) {
        acc.push(grouping);
      }
      return acc;
    }, []);
    const query = params.query;

    this.store.dispatch(new snapshotPageActions.UpdateViewMode({ mode }));
    this.store.dispatch(new snapshotPageActions.UpdateGroupings({ groupings }));
    this.store.dispatch(
      new snapshotPageActions.UpdateFilters({
        accounts,
        volumeSnapshotTypes,
        volumeVmIds,
        date,
        query,
        vmIds: vms,
      }),
    );
  }
}
