import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import * as debounce from 'lodash/debounce';

import { State } from '../../reducers';
import * as accountActions from '../../reducers/accounts/redux/accounts.actions';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import * as volumeActions from '../../reducers/volumes/redux/volumes.actions';
import * as fromVolumes from '../../reducers/volumes/redux/volumes.reducers';
import * as zoneActions from '../../reducers/zones/redux/zones.actions';
import * as fromZones from '../../reducers/zones/redux/zones.reducers';
import { Grouping, VolumeType } from '../../shared/models';
import { FilterService } from '../../shared/services/filter.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';

const FILTER_KEY = 'volumeListFilters';

@Component({
  selector: 'cs-volume-filter-container',
  template: `
    <cs-volume-filter
      *loading="loading$ | async"
      [zones]="zones$ | async"
      [accounts]="accounts$ | async"
      [types]="types"
      [query]="query$ | async"
      [groupings]="groupings"
      [spareOnly]="spareOnly$ | async"
      [selectedGroupings]="selectedGroupings"
      [selectedZoneIds]="selectedZoneIds$ | async"
      [selectedTypes]="selectedTypes$ | async"
      [selectedAccountIds]="selectedAccountIds$ | async"
      (queryChanged)="onQueryChange($event)"
      (spareOnlyChanged)="onSpareOnlyChange($event)"
      (zonesChanged)="onZonesChange($event)"
      (accountsChanged)="onAccountsChange($event)"
      (typesChanged)="onTypesChange($event)"
      (groupingsChanged)="onGroupingsChange($event)"
    ></cs-volume-filter>`,
})
export class VolumeFilterContainerComponent extends WithUnsubscribe()
  implements OnInit, AfterViewInit {
  @Input()
  groupings: Grouping[];
  @Input()
  selectedGroupings: Grouping[];

  readonly filters$ = this.store.pipe(select(fromVolumes.filters));
  readonly query$ = this.store.pipe(select(fromVolumes.filterQuery));
  readonly spareOnly$ = this.store.pipe(select(fromVolumes.filterSpareOnly));
  readonly zones$ = this.store.pipe(select(fromZones.selectAll));
  readonly accounts$ = this.store.pipe(select(fromAccounts.selectAll));
  readonly loading$ = this.store.pipe(select(fromVolumes.isLoading));

  readonly selectedZoneIds$ = this.store.pipe(select(fromVolumes.filterSelectedZoneIds));
  readonly selectedTypes$ = this.store.pipe(select(fromVolumes.filterSelectedTypes));
  readonly selectedAccountIds$ = this.store.pipe(select(fromVolumes.filterSelectedAccountIds));

  public types = [VolumeType.ROOT, VolumeType.DATADISK];

  private filterService = new FilterService(
    {
      spareOnly: { type: 'boolean', defaultOption: false },
      zones: { type: 'array', defaultOption: [] },
      types: { type: 'array', defaultOption: [] },
      groupings: { type: 'array', defaultOption: [] },
      query: { type: 'string' },
      accounts: { type: 'array', defaultOption: [] },
    },
    this.router,
    this.sessionStorage,
    FILTER_KEY,
    this.activatedRoute,
  );

  constructor(
    private cd: ChangeDetectorRef,
    private store: Store<State>,
    private sessionStorage: SessionStorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    super();
    this.onQueryChange = debounce(this.onQueryChange.bind(this), 500);
  }

  public ngOnInit() {
    this.store.dispatch(new zoneActions.LoadZonesRequest());
    this.store.dispatch(new accountActions.LoadAccountsRequest());
    this.initFilters();
    this.filters$.pipe(takeUntil(this.unsubscribe$)).subscribe(filters => {
      this.filterService.update({
        spareOnly: filters.spareOnly,
        zones: filters.selectedZoneIds,
        types: filters.selectedTypes,
        groupings: filters.selectedGroupings.map(_ => _.key),
        query: filters.query,
        accounts: filters.selectedAccountIds,
      });
    });
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public onSpareOnlyChange(spareOnly) {
    this.store.dispatch(new volumeActions.VolumeFilterUpdate({ spareOnly }));
  }

  public onQueryChange(query) {
    this.store.dispatch(new volumeActions.VolumeFilterUpdate({ query }));
  }

  public onZonesChange(selectedZoneIds) {
    this.store.dispatch(new volumeActions.VolumeFilterUpdate({ selectedZoneIds }));
  }

  public onAccountsChange(selectedAccountIds) {
    this.store.dispatch(new volumeActions.VolumeFilterUpdate({ selectedAccountIds }));
  }

  public onTypesChange(selectedTypes) {
    this.store.dispatch(new volumeActions.VolumeFilterUpdate({ selectedTypes }));
  }

  public onGroupingsChange(selectedGroupings) {
    this.store.dispatch(new volumeActions.VolumeFilterUpdate({ selectedGroupings }));
  }

  private initFilters(): void {
    const params = this.filterService.getParams();
    const spareOnly = params.spareOnly;
    const query = params.query;

    const selectedZoneIds = params['zones'];
    const selectedTypes = params['types'];

    const selectedGroupings = params['groupings'].reduce((acc, _) => {
      const grouping = this.groupings.find(g => g.key === _);
      if (grouping) {
        acc.push(grouping);
      }
      return acc;
    }, []);

    const selectedAccountIds = params['accounts'];

    this.store.dispatch(
      new volumeActions.VolumeFilterUpdate({
        spareOnly,
        query,
        selectedTypes,
        selectedZoneIds,
        selectedAccountIds,
        selectedGroupings,
      }),
    );
  }
}
