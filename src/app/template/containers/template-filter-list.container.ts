import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { BaseTemplateModel } from '../shared/base-template.model';


@Component({
  selector: 'cs-template-filter-list-container',
  templateUrl: 'template-filter-list.container.html'
})
export class TemplateFilterListContainerComponent extends WithUnsubscribe() implements OnInit, AfterViewInit {
  readonly filters$ = this.store.select(fromTemplates.filters);
  readonly osTypes$ = this.store.select(fromOsTypes.selectAll);
  readonly accounts$ = this.store.select(fromAccounts.selectAll);
  readonly domains$ = this.store.select(fromDomains.selectEntities);
  readonly zones$ = this.store.select(fromZones.selectAll);
  readonly query$ = this.store.select(fromTemplates.filterQuery);

  readonly templates$ = this.store.select(fromTemplates.selectFilteredTemplates);
  readonly isLoading$ = this.store.select(fromTemplates.isLoading);

  readonly selectedOsFamilies$ = this.store.select(fromTemplates.filterSelectedOsFamilies);
  readonly selectedTypes$ = this.store.select(fromTemplates.filterSelectedTypes);
  readonly selectedViewMode$ = this.store.select(fromTemplates.filterSelectedViewMode);

  @Output() public selectedTemplateChange = new EventEmitter();
  public _selectedTemplate: BaseTemplateModel;

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
      'osFamilies': { type: 'array', options: this.osFamilies, defaultOption: [] },
      'types': { type: 'array', options: this.categoryFilters, defaultOption: [] },
      'query': { type: 'string' }
    },
    this.router,
    this.sessionStorage,
    'eventListFilters',
    this.activatedRoute
  );


  public get selectedTemplate(): BaseTemplateModel {
    return this._selectedTemplate;
  }

  @Input()
  public set selectedTemplate(template: BaseTemplateModel) {
    this._selectedTemplate = template;
  }


  constructor(private store: Store<State>,
              private router: Router,
              private sessionStorage: SessionStorageService,
              private activatedRoute: ActivatedRoute,
              private cd: ChangeDetectorRef) {
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

  public selectTemplate(template: BaseTemplateModel): void {
    this.selectedTemplate = template;
    this.selectedTemplateChange.emit(this.selectedTemplate);
  }

  public onQueryChange(query) {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({ query }));
  }

  public onOsFamiliesChange(selectedOsFamilies) {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({ selectedOsFamilies }));
  }

  public onTypesChange(selectedTypes) {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({ selectedTypes }));
  }

  public onViewModeChange(selectedViewMode) {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({ selectedViewMode }));
  }

  public update(
    selectedViewMode,
    selectedOsFamilies,
    selectedTypes,
    query
  ) {
    this.store.dispatch(new templateActions.TemplatesFilterUpdate({
      selectedViewMode,
      selectedOsFamilies,
      selectedTypes,
      query
    }));
  }

  private initFilters(): void {
    const params = this.filterService.getParams();
    const selectedViewMode = params['viewMode'];
    const selectedOsFamilies = params['osFamilies'];
    const selectedTypes = params['types'];
    const query = params['query'];

    this.update(
      selectedViewMode,
      selectedOsFamilies,
      selectedTypes,
      query
    );

    this.filters$
      .takeUntil(this.unsubscribe$)
      .subscribe(filters => {
        this.filterService.update({
          'viewMode': filters.selectedViewMode,
          'osFamilies': filters.selectedOsFamilies,
          'types': filters.selectedTypes,
          'query': filters.query,
        });
      });
  }
}
