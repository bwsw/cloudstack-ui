import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '../../shared/services/session-storage.service';
import { TemplateService } from '../shared/template.service';
import { AuthService } from '../../shared/services/auth.service';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { OsFamily } from '../../shared/models/os-type.model';
import { TemplateFilters } from '../shared/base-template.service';
import { BaseTemplateModel } from '../shared/base-template.model';
import { FilterService } from '../../shared/services/filter.service';

import * as fromTemplates from '../redux/template.reducers';
import * as templateActions from '../redux/template.actions';

@Component({
  selector: 'cs-template-page-container',
  templateUrl: 'template-page.container.html'
})
export class TemplatePageContainerComponent extends WithUnsubscribe() implements OnInit {
  public templates$ = this.store.select(fromTemplates.selectFilteredTemplates);
  readonly isLoading$ = this.store.select(fromTemplates.isLoading);
  readonly filters$ = this.store.select(fromTemplates.filters);
  // readonly query$ = this.store.select(fromTemplates.filterQuery);
  readonly selectedAccounts$ = this.store.select(fromTemplates.filterSelectedAccounts);
  // readonly selectedOsFamilies$ = this.store.select(fromTemplates.filterSelectedOSFamilies);
  // readonly selectedTypes$ = this.store.select(fromTemplates.filterSelectedTypes);
  readonly selectedZones$ = this.store.select(fromTemplates.filterSelectedZones);
  readonly selectedViewMode$ = this.store.select(fromTemplates.filterSelectedViewMode);
  // readonly selectedGroupBy$ = this.store.select(fromTemplates.filterGroupBy);

  // readonly templateZones$ = this.store.select(fromTemplates.templateZones)
  //   .withLatestFrom(this.selectedZones$)
  //   .map(([all, selected]) => {
  //     const set = new Set(all.concat(selected));
  //     return [...Array.from(set)];
  //   });

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

  public domainList: Array<any> = [];

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
      name: (item: BaseTemplateModel) =>
        `${this.getDomain(item.domainId)}${item.account}` || `${item.domain}/${item.account}`,
    }
  ];

  public selectedViewMode = '';
  public selectedAccounts = [];
  public selectedOsFamilies = [];
  public selectedTypes = [];
  public selectedZones = [];
  public selectedGroupings = [];
  public query = '';

  private filterService = new FilterService(
    {
      'viewMode': { type: 'string', defaultOption: 'Template' },
      'accounts': { type: 'array', defaultOption: [] },
      'osFamilies': { type: 'array', options: this.osFamilies, defaultOption: [] },
      'types': { type: 'array', options: this.categoryFilters, defaultOption: [] },
      'zones': { type: 'array', defaultOption: [] },
      'grouping': { type: 'array', defaultOption: [] },
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
    private activatedRoute: ActivatedRoute,
    private templateService: TemplateService,
    private authService: AuthService
  ) {
    super();

    // this.onQueryChange = debounce(this.onQueryChange.bind(this), 500);
  }

  public ngOnInit() {
    this.initFilters();
    this.filters$
      .takeUntil(this.unsubscribe$)
      .subscribe(filters => {
        this.filterService.update({
          'viewMode': filters.selectedViewMode,
          'accounts': filters.selectedAccounts,
          'osFamilies': filters.selectedOsFamilies,
          'types': filters.selectedTypes,
          'zones': filters.selectedZones,
          'grouping': filters.selectedGroupings,
          'query': filters.query,
        });
      });
  }

  private initFilters(): void {
    const params = this.filterService.getParams();

    this.selectedViewMode = params['viewMode'];
    this.selectedAccounts = params['accounts'];
    this.selectedOsFamilies = params['osFamilies'];
    this.selectedTypes = params['categoryFilters'];
    this.selectedZones = params['zones'];
    this.selectedGroupings = params['groupings'];
    this.query = params['query'];
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({
      selectedViewMode: this.selectedViewMode,
      selectedAccounts: this.selectedAccounts,
      selectedOsFamilies: this.selectedOsFamilies,
      selectedTypes: this.selectedTypes,
      selectedZones: this.selectedZones,
      selectedGroupings: this.selectedGroupings,
      query: this.query
    }));
  }

  public onQueryChange(query) {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({ query }));
  }

  public onFiltersChange(filters) {
    //
    //
    // if (filters.selectedTypes) {
    //   this.onTypesChange(filters.selectedTypes);
    // }
    // if (filters.selectedAccounts) {
    //   this.onAccountsChange(filters.selectedAccounts);
    // }
    // if (filters.selectedOsFamilies) {
    //   this.onOSFamiliesChange(filters.selectedOsFamilies);
    // }
    // if (filters.selectedZones) {
    //   this.onZonesChange(filters.selectedZones);
    // }
    // if (filters.selectedGroupings) {
    //   this.onGroupingsChange(filters.selectedGroupings);
    // }
  }

  public onAccountsChange(selectedAccounts) {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({ selectedAccounts }));
  }

  public onOSFamiliesChange(selectedOsFamilies) {
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

  private getDomain(domainId: string) {
    const domain = this.domainList && this.domainList.find(d => d.id === domainId);
    return domain ? domain.getPath() : '';
  }
}
