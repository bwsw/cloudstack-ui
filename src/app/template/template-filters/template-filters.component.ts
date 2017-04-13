import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import debounce = require('lodash/debounce');
import { Subject } from 'rxjs/Subject';

import { TranslateService } from 'ng2-translate';

import { OsFamily, StorageService } from '../../shared';
import { FilterService } from '../../shared/services';
import { Zone } from '../../shared/models/zone.model';
import { ZoneService } from '../../shared/services/zone.service';


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

  @Output() public queries = new EventEmitter();
  @Output() public displayMode = new EventEmitter();
  @Output() public filters = new EventEmitter();

  public query: string;
  public selectedOsFamilies: Array<OsFamily>;
  public selectedFilters: Array<string>;

  public zones: Array<Zone>;
  public selectedZones: Array<Zone>;

  public filterTranslations: {};

  public osFamilies: Array<OsFamily> = [
    'Linux',
    'Windows',
    'Mac OS',
    'Other'
  ];

  public categoryFilters = [
    'featured',
    'self'
  ];

  private filtersKey = 'imageListFilters';

  private templateTabIndex = 0;
  private isoTabIndex = 1;

  private queryStream = new Subject<string>();

  constructor(
    private filter: FilterService,
    private storageService: StorageService,
    private translateService: TranslateService,
    private zoneService: ZoneService
  ) {
    this.updateFilters = debounce(this.updateFilters, 300);
  }

  public ngOnInit(): void {
    if (!this.dialogMode) {
      this.zoneService.getList().subscribe(zones => {
        this.zones = zones;
        this.initFilters();
      });
    } else {
      this.selectedOsFamilies = this.osFamilies.concat();
      this.selectedFilters = this.categoryFilters.concat();
    }

    this.queryStream
      .distinctUntilChanged()
      .subscribe(query => this.queries.emit(query));

    this.translateService.get(
      this.categoryFilters.map(filter => `TEMPLATE_${filter.toUpperCase()}`)
    )
      .subscribe(translations => {
        const strs = {};
        this.categoryFilters.forEach(f => {
          strs[f] = translations[`TEMPLATE_${f.toUpperCase()}`];
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
      query: this.query
    });

    if (!this.dialogMode) {
      this.filter.update(this.filtersKey, {
        'query': this.query || null,
        'osFamilies': this.selectedOsFamilies,
        'categoryFilters': this.selectedFilters,
        'zones': this.selectedZones.map(_ => _.id)
      });
    }
  }

  public updateDisplayMode(): void {
    let mode = this.showIso ? 'Iso' : 'Template';
    this.displayMode.emit(mode);
    this.storageService.write('templateDisplayMode', mode);
  }

  private initFilters(): void {
    const params = this.filter.init(this.filtersKey, {
      'osFamilies': {
        type: 'array',
        options: this.osFamilies,
        defaultOption: this.osFamilies
      },
      'categoryFilters': {
        type: 'array',
        options: this.categoryFilters,
        defaultOption: this.categoryFilters
      },
      'zones': {
        type: 'array',
        options: this.zones,
        defaultOption: []
      },
      'query': { type: 'string' }
    });
    this.selectedOsFamilies = params['osFamilies'];
    this.selectedFilters = params['categoryFilters'];
    this.selectedZones = this.zones.filter(zone => params['zones'].find(id => id === zone.id));
    this.query = params['query'];
    this.queryStream.next(this.query);
  }
}
