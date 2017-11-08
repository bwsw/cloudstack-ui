import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { Component, OnInit } from '@angular/core';
import { OsFamily } from '../../shared/models/os-type.model';
import { TemplateFilters } from '../shared/base-template.service';
import { FilterService } from '../../shared/services/filter.service';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '../../shared/services/session-storage.service';

import * as fromTemplates from '../redux/template.reducers';
import * as templateActions from '../redux/template.actions';
import * as fromOsTypes from '../redux/ostype.reducers';
import * as osTypesActions from '../redux/ostype.actions';
import * as zonesActions from '../redux/zone.actions';
import * as fromZones from '../redux/zone.reducers';
import * as accountsActions from '../../reducers/accounts/redux/accounts.actions';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import * as domainActions from '../../reducers/domains/redux/domains.actions';
import * as fromDomains from '../../reducers/domains/redux/domains.reducers';
import { State } from '../../reducers/index';
import { templateGroupings } from './template-page.container';


@Component({
  selector: 'cs-template-filter-container',
  templateUrl: 'template-filter.container.html'
})
export class TemplateFilterContainerComponent extends WithUnsubscribe() implements OnInit {
  readonly filters$ = this.store.select(fromTemplates.filters);
  readonly osTypes$ = this.store.select(fromOsTypes.selectAll);
  readonly accounts$ = this.store.select(fromAccounts.selectAll);
  readonly domains$ = this.store.select(fromDomains.selectEntities);
  readonly zones$ = this.store.select(fromZones.selectAll);
  readonly query$ = this.store.select(fromTemplates.filterQuery);

  readonly selectedAccountIds$ = this.store.select(fromTemplates.filterSelectedAccountIds);
  readonly selectedOsFamilies$ = this.store.select(fromTemplates.filterSelectedOsFamilies);
  readonly selectedTypes$ = this.store.select(fromTemplates.filterSelectedTypes);
  readonly selectedZones$ = this.store.select(fromTemplates.filterSelectedZones);
  readonly selectedViewMode$ = this.store.select(fromTemplates.filterSelectedViewMode);
  readonly selectedGroupings$ = this.store.select(fromTemplates.filterSelectedGroupings);

  public osFamilies: Array<OsFamily> = [
    OsFamily.Linux,
    OsFamily.Windows,
    OsFamily.MacOs,
    OsFamily.Other
  ];

  public categoryFilters = [
    TemplateFilters.featured,
    TemplateFilters.self
  ];

  private filterService = new FilterService(
    {
      'viewMode': { type: 'string', defaultOption: 'Template' },
      'accounts': { type: 'array', defaultOption: [] },
      'osFamilies': { type: 'array', options: this.osFamilies, defaultOption: [] },
      'types': { type: 'array', options: this.categoryFilters, defaultOption: [] },
      'zones': { type: 'array', defaultOption: [] },
      'groupings': { type: 'array', defaultOption: [] },
      'query': { type: 'string' }
    },
    this.router,
    this.sessionStorage,
    'eventListFilters',
    this.activatedRoute
  );

  constructor(private store: Store<State>,
              private router: Router,
              private sessionStorage: SessionStorageService,
              private activatedRoute: ActivatedRoute) {
    super();
  }

  public ngOnInit() {
    this.store.dispatch(new zonesActions.LoadZonesRequest());
    this.store.dispatch(new osTypesActions.LoadOsTypesRequest());
    this.store.dispatch(new accountsActions.LoadAccountsRequest());
    this.store.dispatch(new domainActions.LoadDomainsRequest());
    this.initFilters();
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

  public update(
    selectedViewMode,
    selectedAccountIds,
    selectedOsFamilies,
    selectedTypes,
    selectedZones,
    selectedGroupings,
    query
  ) {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({
      selectedViewMode,
      selectedAccountIds,
      selectedOsFamilies,
      selectedTypes,
      selectedZones,
      selectedGroupings,
      query
    }));
  }

  private initFilters(): void {
    const params = this.filterService.getParams();
    const selectedGroupings = params['groupings'].reduce((acc, _) => {
      const grouping = templateGroupings.find(g => g.key === _);
      if (grouping) {
        acc.push(grouping);
      }
      return acc;
    }, []);

    const selectedViewMode = params['viewMode'];
    const selectedAccounts = params['accounts'];
    const selectedOsFamilies = params['osFamilies'];
    const selectedTypes = params['types'];
    const selectedZones = params['zones'];
    const query = params['query'];

    this.update(
      selectedViewMode,
      selectedAccounts,
      selectedOsFamilies,
      selectedTypes,
      selectedZones,
      selectedGroupings,
      query
    );

    this.filters$
      .takeUntil(this.unsubscribe$)
      .subscribe(filters => {
        this.filterService.update({
          'viewMode': filters.selectedViewMode,
          'accounts': filters.selectedAccountIds,
          'osFamilies': filters.selectedOsFamilies,
          'types': filters.selectedTypes,
          'zones': filters.selectedZones,
          'groupings': filters.selectedGroupings.map(_ => _.key),
          'query': filters.query,
        });
      });
  }
}
