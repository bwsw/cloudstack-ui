import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs/Subject';

import { OsFamily } from '../../shared/models/os-type.model';
import { Zone } from '../../shared/models/zone.model';
import { FilterService } from '../../shared/services/filter.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { ZoneService } from '../../shared/services/zone.service';
import { TemplateFilters } from '../shared/base-template.service';


@Component({
  selector: 'cs-template-filters',
  templateUrl: 'template-filters.component.html',
  styleUrls: ['template-filters.component.scss']
})
export class TemplateFiltersComponent implements OnInit {
  @Input() public showIsoSwitch = true;
  @Input() public showDelimiter = false;
  @Input() public showIso: boolean;
  @Input() public dialogMode = false;
  @Input() public searchPanelWhite: boolean;
  @Input() public availableGroupings: Array<any> = [];

  @Output() public queries = new EventEmitter();
  @Output() public displayMode = new EventEmitter();
  @Output() public filters = new EventEmitter();

  public query: string;
  public selectedOsFamilies: Array<OsFamily>;
  public selectedFilters: Array<string>;
  public selectedGroupingNames = [];

  public zones: Array<Zone>;
  public selectedZones: Array<Zone>;

  public filterTranslations: {};

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

  private filtersKey = 'imageListFilters';
  private filterService = new FilterService({
    osFamilies: {
      type: 'array',
      options: this.osFamilies,
      defaultOption: []
    },
    categoryFilters: {
      type: 'array',
      options: this.categoryFilters,
      defaultOption: []
    },
    zones: {
      type: 'array',
      defaultOption: []
    },
    query: { type: 'string' },
    groupings: { type: 'array', defaultOption: [] }
  }, this.router, this.storageService, this.filtersKey, this.activatedRoute);

  private templateTabIndex = 0;
  private isoTabIndex = 1;

  private queryStream = new Subject<string>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: LocalStorageService,
    private translateService: TranslateService,
    private zoneService: ZoneService
  ) {
  }

  public ngOnInit(): void {
    if (!this.dialogMode) {
      this.zoneService.getList()
        .subscribe(zones => {
          this.zones = zones;
          setTimeout(() => this.initFilters(), 0);
        });
    } else {
      this.selectedOsFamilies = this.osFamilies.concat();
      this.selectedFilters = this.categoryFilters.concat();
    }

    this.queryStream
      .distinctUntilChanged()
      .subscribe(query => this.queries.emit(query));

    this.translateService.get(
      this.categoryFilters.map(filter => `TEMPLATE_PAGE.FILTERS.${filter.toUpperCase()}`)
    )
      .subscribe(translations => {
        const strs = {};
        this.categoryFilters.forEach(f => {
          strs[f] = translations[`TEMPLATE_PAGE.FILTERS.${f.toUpperCase()}`];
        });
        this.filterTranslations = strs;
      });
  }

  public get templateSwitchPosition(): number {
    return this.showIso ? this.isoTabIndex : this.templateTabIndex;
  }

  public setMode(index: number): void {
    this.showIso = index === this.isoTabIndex;
    this.updateDisplayMode();
  }

  public updateFilters(): void {
    this.filters.emit({
      selectedOsFamilies: this.selectedOsFamilies,
      selectedFilters: this.selectedFilters,
      selectedZones: this.selectedZones,
      query: this.query,
      groupings: this.selectedGroupingNames
    });

    if (!this.dialogMode) {
      this.filterService.update({
        query: this.query || null,
        osFamilies: this.selectedOsFamilies,
        categoryFilters: this.selectedFilters,
        zones: this.selectedZones.map(_ => _.id),
        groupings: this.selectedGroupingNames.map(_ => _.key)
      });
    }
  }

  public updateDisplayMode(): void {
    const mode = this.showIso ? 'Iso' : 'Template';
    this.displayMode.emit(mode);
    this.storageService.write('templateDisplayMode', mode);
  }

  private initFilters(): void {
    const params = this.filterService.getParams();
    this.selectedOsFamilies = params['osFamilies'];
    this.selectedFilters = params['categoryFilters'];
    this.selectedZones = this.zones.filter(
      zone => params['zones'].find(id => id === zone.id));
    this.selectedGroupingNames = params['groupings']
      .map(g => this.availableGroupings.find(_ => _.key === g))
      .filter(g => g);
    this.query = params['query'];
    this.queryStream.next(this.query);

    this.updateFilters();
  }
}
