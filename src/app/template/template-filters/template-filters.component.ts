import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OsFamily } from '../../shared/models/os-type.model';
import { Zone } from '../../shared/models/zone.model';
import { TemplateFilters } from '../shared/base-template.service';
import { Account } from '../../shared/models/account.model';
import { Domain } from '../../shared/models/domain.model';


@Component({
  selector: 'cs-template-filters',
  templateUrl: 'template-filters.component.html',
  styleUrls: ['template-filters.component.scss']
})
export class TemplateFiltersComponent implements OnInit, OnChanges {
  @Input() public showIsoSwitch = true;
  @Input() public showDelimiter = false;
  @Input() public showIso: boolean;
  @Input() public dialogMode = false;
  @Input() public searchPanelWhite: boolean;
  @Input() public availableGroupings: Array<any> = [];
  @Input() public accounts: Array<Account> = [];
  @Input() public zones: Array<Zone>;
  @Input() public domains: Array<Domain>;
  @Input() public selectedAccounts: any[];
  @Input() public selectedGroupings: any[];
  @Input() public selectedFilters: string[];
  @Input() public selectedZones: Zone[];
  @Input() public selectedOsFamilies: OsFamily[];
  @Input() public query: string;

  @Output() public queries = new EventEmitter();
  @Output() public displayMode = new EventEmitter();
  @Output() public filters = new EventEmitter();
  @Output() public selectedAccountsChange = new EventEmitter();
  @Output() public selectedGroupingsChange = new EventEmitter();
  @Output() public selectedZonesChange = new EventEmitter();
  @Output() public selectedOsFamiliesChange = new EventEmitter();
  @Output() public selectedTypesChange = new EventEmitter();
  @Output() public queryChange = new EventEmitter();

  public selectedGroupingNames = [];
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

  private templateTabIndex = 0;
  private isoTabIndex = 1;
  private domainsMap: object;

  constructor(private translateService: TranslateService) {
  }

  public ngOnInit(): void {
    if (this.dialogMode) {
      this.selectedOsFamilies = this.osFamilies.concat();
      this.selectedFilters = this.categoryFilters.concat();
    }
    this.selectedAccounts = this.selectedAccounts.reduce((m, i) => {
      const grouping = this.accounts.find(a => a.id === i);
      if (grouping) {
        m.push(grouping);
      }
      return m;
    }, []);

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

  public ngOnChanges(changes) {
    if (changes.domains) {
      this.domainsMap = this.domains.reduce((m, i) => ({ ...m, [i.id]: i }), {});
    }
  }

  public accountFullDomain(account) {
    const domain = this.domainsMap[account.domainid];
    return domain.getPath();
  }

  public get templateSwitchPosition(): number {
    return this.showIso ? this.isoTabIndex : this.templateTabIndex;
  }

  public setMode(index: number): void {
    this.showIso = Number(index) === this.isoTabIndex;
    this.updateDisplayMode();
  }

  public updateFilters(): void {
    this.filters.emit({
      selectedOsFamilies: this.selectedOsFamilies,
      selectedTypes: this.selectedFilters,
      selectedZones: this.selectedZones,
      query: this.query,
      groupings: this.selectedGroupingNames,
      accounts: this.selectedAccounts
    });
  }

  public updateDisplayMode(): void {
    const mode = this.showIso ? 'Iso' : 'Template';
    this.displayMode.emit(mode);
  }

  public updateSelectedAccounts() {
    this.selectedAccountsChange.emit(this.selectedAccounts);
  }

  public updateSelectedGroupings(selectedGroupings) {
    this.selectedGroupingsChange.emit(selectedGroupings);
  }

  public updateSelectedTypes() {
    this.selectedTypesChange.emit(this.selectedFilters);
  }

  public updateSelectedOsFamilies() {
    this.selectedOsFamiliesChange.emit(this.selectedOsFamilies);
  }

  public updateSelectedZones() {
    this.selectedZonesChange.emit(this.selectedZones);
  }

  public updateQuery() {
    this.queryChange.emit(this.query);
  }
}
