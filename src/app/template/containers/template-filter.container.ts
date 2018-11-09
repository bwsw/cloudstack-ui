import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';

import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { OsFamily } from '../../shared/models';
import { templateFilters, templateResourceType } from '../shared/base-template.service';
import { FilterService } from '../../shared/services/filter.service';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { configSelectors, State } from '../../root-store';

import * as fromTemplates from '../../reducers/templates/redux/template.reducers';
import * as templateActions from '../../reducers/templates/redux/template.actions';
import * as fromOsTypes from '../../reducers/templates/redux/ostype.reducers';
import * as osTypesActions from '../../reducers/templates/redux/ostype.actions';
import * as zonesActions from '../../reducers/templates/redux/zone.actions';
import * as fromZones from '../../reducers/templates/redux/zone.reducers';
import * as accountsActions from '../../reducers/accounts/redux/accounts.actions';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import * as domainActions from '../../reducers/domains/redux/domains.actions';
import * as fromDomains from '../../reducers/domains/redux/domains.reducers';

const FILTER_KEY = 'templateListFilters';

@Component({
  selector: 'cs-template-filter-container',
  templateUrl: 'template-filter.container.html',
})
export class TemplateFilterContainerComponent extends WithUnsubscribe()
  implements OnInit, AfterViewInit {
  readonly filters$ = this.store.pipe(select(fromTemplates.filters));
  readonly loading$ = this.store.pipe(select(fromTemplates.isLoading));
  readonly osTypes$ = this.store.pipe(select(fromOsTypes.selectAll));
  readonly accounts$ = this.store.pipe(select(fromAccounts.selectAll));
  readonly domains$ = this.store.pipe(select(fromDomains.selectEntities));
  readonly zones$ = this.store.pipe(select(fromZones.selectAll));
  readonly query$ = this.store.pipe(select(fromTemplates.filterQuery));
  readonly groups$ = this.store.pipe(select(configSelectors.get('imageGroups')));

  readonly selectedAccountIds$ = this.store.pipe(select(fromTemplates.filterSelectedAccountIds));
  readonly selectedOsFamilies$ = this.store.pipe(select(fromTemplates.filterSelectedOsFamilies));
  readonly selectedTypes$ = this.store.pipe(select(fromTemplates.filterSelectedTypes));
  readonly selectedZones$ = this.store.pipe(select(fromTemplates.filterSelectedZones));
  readonly selectedViewMode$ = this.store.pipe(select(fromTemplates.filterSelectedViewMode));
  readonly selectedGroups$ = this.store.pipe(select(fromTemplates.filterSelectedGroups));
  readonly selectedGroupings$ = this.store.pipe(select(fromTemplates.filterSelectedGroupings));

  @Input()
  public availableGroupings = [];
  @Input()
  public dialogMode = false;
  @Input()
  public showIsoSwitch = true;
  @Input()
  public zoneId: string;
  @Input()
  public viewMode: string;

  public osFamilies: OsFamily[] = [
    OsFamily.Linux,
    OsFamily.Windows,
    OsFamily.MacOs,
    OsFamily.Other,
  ];

  public categoryFilters = [templateFilters.featured, templateFilters.self];

  private filterService = new FilterService(
    {
      viewMode: { type: 'string', defaultOption: templateResourceType.template },
      accounts: { type: 'array', defaultOption: [] },
      osFamilies: { type: 'array', options: this.osFamilies, defaultOption: [] },
      types: { type: 'array', options: this.categoryFilters, defaultOption: [] },
      zones: { type: 'array', defaultOption: [] },
      groups: { type: 'array', defaultOption: [] },
      groupings: { type: 'array', defaultOption: [] },
      query: { type: 'string' },
    },
    this.router,
    this.sessionStorage,
    FILTER_KEY,
    this.activatedRoute,
  );

  constructor(
    private store: Store<State>,
    private router: Router,
    private sessionStorage: SessionStorageService,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }

  public ngOnInit() {
    this.store.dispatch(new zonesActions.LoadZonesRequest());
    this.store.dispatch(new osTypesActions.LoadOsTypesRequest());
    this.store.dispatch(new accountsActions.LoadAccountsRequest());
    this.store.dispatch(new domainActions.LoadDomainsRequest());

    this.initFilters();
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public onQueryChange(query) {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({ query }));
  }

  public onAccountsChange(selectedAccountIds) {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({ selectedAccountIds }));
  }

  public onOsFamiliesChange(selectedOsFamilies) {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({ selectedOsFamilies }));
  }

  public onTypesChange(selectedTypes) {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({ selectedTypes }));
  }

  public onZonesChange(selectedZones) {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({ selectedZones }));
  }

  public onGroupingsChange(selectedGroupings) {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({ selectedGroupings }));
  }

  public onViewModeChange(selectedViewMode) {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({ selectedViewMode }));
  }

  public onGroupsChange(selectedGroups) {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({ selectedGroups }));
  }

  public update(
    selectedViewMode,
    selectedOsFamilies,
    selectedTypes,
    selectedZones,
    selectedGroupings,
    selectedGroups,
    selectedAccountIds,
    query,
  ) {
    this.store.dispatch(
      new templateActions.TemplatesFilterUpdate({
        selectedViewMode,
        selectedOsFamilies,
        selectedTypes,
        selectedZones,
        selectedGroupings,
        selectedGroups,
        selectedAccountIds,
        query,
      }),
    );
  }

  private initFilters(): void {
    const params = this.filterService.getParams();
    const selectedGroupings = params['groupings'].reduce((acc, _) => {
      const grouping = this.availableGroupings.find(g => g.key === _);
      if (grouping) {
        acc.push(grouping);
      }
      return acc;
    }, []);

    const selectedOsFamilies = params['osFamilies'];
    const selectedTypes = params['types'];
    const selectedGroups = params['groups'];
    const query = params['query'];

    const selectedViewMode = !this.dialogMode
      ? params['viewMode']
      : this.viewMode && this.viewMode.toLowerCase();
    const selectedAccounts = !this.dialogMode ? params['accounts'] : [];
    const selectedZones = !this.dialogMode ? params['zones'] : [this.zoneId];

    this.update(
      selectedViewMode,
      selectedOsFamilies,
      selectedTypes,
      selectedZones,
      selectedGroupings,
      selectedGroups,
      selectedAccounts,
      query,
    );

    this.filters$.pipe(takeUntil(this.unsubscribe$)).subscribe(filters => {
      if (!this.dialogMode) {
        this.filterService.update({
          viewMode: filters.selectedViewMode,
          accounts: filters.selectedAccountIds,
          osFamilies: filters.selectedOsFamilies,
          types: filters.selectedTypes,
          zones: filters.selectedZones,
          groups: filters.selectedGroups,
          groupings: filters.selectedGroupings.map(_ => _.key),
          query: filters.query,
        });
      }
    });
  }
}
