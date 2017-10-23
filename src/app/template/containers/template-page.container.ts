import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { OsFamily } from '../../shared/models/os-type.model';
import { TemplateFilters } from '../shared/base-template.service';
import { BaseTemplateModel } from '../shared/base-template.model';
import { FilterService } from '../../shared/services/filter.service';

import * as fromTemplates from '../redux/template.reducers';
import * as templateActions from '../redux/template.actions';
import * as fromOsTypes from '../redux/ostype.reducers';
import * as osTypesActions from '../redux/ostype.actions';
import * as zonesActions from '../redux/zone.actions';
import * as fromZones from '../redux/zone.reducers';
import * as accountsActions from '../../account/redux/accounts.actions';
import * as fromAccounts from '../../account/redux/accounts.reducers';
import * as domainActions from '../../domains/redux/domains.actions';
import * as fromDomains from '../../domains/redux/domains.reducers';

@Component({
  selector: 'cs-template-page-container',
  templateUrl: 'template-page.container.html'
})
export class TemplatePageContainerComponent extends WithUnsubscribe() implements OnInit {
  public templates$ = this.store.select(fromTemplates.selectFilteredTemplates);
  readonly isLoading$ = this.store.select(fromTemplates.isLoading);
  readonly filters$ = this.store.select(fromTemplates.filters);
  readonly osTypes$ = this.store.select(fromOsTypes.osTypes);
  readonly accounts$ = this.store.select(fromAccounts.accounts);
  readonly domains$ = this.store.select(fromDomains.domains);
  readonly zones$ = this.store.select(fromZones.zones);
  readonly query$ = this.store.select(fromTemplates.filterQuery);
  readonly selectedAccounts$ = this.store.select(fromTemplates.filterSelectedAccounts);
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

  public groupings = [
    {
      key: 'zones',
      label: 'TEMPLATE_PAGE.FILTERS.GROUP_BY_ZONES',
      selector: (item: BaseTemplateModel) => item.zoneId || '',
      name: (item: BaseTemplateModel) => item.zoneName || 'TEMPLATE_PAGE.FILTERS.NO_ZONE'
    },
    {
      key: 'accounts',
      label: 'TEMPLATE_PAGE.FILTERS.GROUP_BY_ACCOUNTS',
      selector: (item: BaseTemplateModel) => item.account,
      name: (item: BaseTemplateModel) => this.getGroupName(item),
    }
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

  constructor(
    private store: Store<State>,
    private router: Router,
    private sessionStorage: SessionStorageService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  public ngOnInit() {
    this.store.dispatch(new zonesActions.LoadZonesRequest());
    this.store.dispatch(new osTypesActions.LoadOsTypesRequest());
    this.store.dispatch(new accountsActions.LoadAccountsRequest());
    this.store.dispatch(new domainActions.LoadDomainsRequest());
    this.initFilters();
    this.filters$
      .takeUntil(this.unsubscribe$)
      .subscribe(filters => {
        this.filterService.update({
          'viewMode': filters.selectedViewMode,
          'accounts': filters.selectedAccounts.map(_ => _.id),
          'osFamilies': filters.selectedOsFamilies,
          'types': filters.selectedTypes,
          'zones': filters.selectedZones,
          'groupings': filters.selectedGroupings.map(_ => _.key),
          'query': filters.query,
        });
      });
  }

  private initFilters(): void {
    const params = this.filterService.getParams();
    const selectedGroupings = params['groupings'].reduce((acc, _) => {
      const grouping = this.groupings.find(g => g.key === _);
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
  }

  public onQueryChange(query) {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({ query }));
  }

  public onAccountsChange(selectedAccounts) {
    console.log(selectedAccounts[0]);
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({ selectedAccounts }));
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
    selectedAccounts,
    selectedOsFamilies,
    selectedTypes,
    selectedZones,
    selectedGroupings,
    query
  ) {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({
      selectedViewMode,
      selectedAccounts,
      selectedOsFamilies,
      selectedTypes,
      selectedZones,
      selectedGroupings,
      query
    }));
  }

  private getGroupName(template: BaseTemplateModel) {
    return template.domain !== 'ROOT'
      ? `${template.domain}/${template.account}`
      : template.account;
  }
}
