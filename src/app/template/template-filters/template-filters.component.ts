import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { OsFamily } from '../../shared/models/os-type.model';
import { Zone } from '../../shared/models/zone.model';
import { TemplateFilters } from '../shared/base-template.service';
import { Account } from '../../shared/models/account.model';
import { Domain } from '../../shared/models/domain.model';
import { Dictionary } from '@ngrx/entity/src/models';
import { AuthService } from '../../shared/services/auth.service';


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
  @Input() public selectedAccountIds: string[];
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
  public filterTranslations = {
    [TemplateFilters.featured]: 'TEMPLATE_PAGE.FILTERS.FEATURED',
    [TemplateFilters.self]: 'TEMPLATE_PAGE.FILTERS.SELF'
  };

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
  private domainsMap: Dictionary<Domain>;

  constructor(private authService: AuthService) {
  }

  public ngOnInit(): void {
    if (this.dialogMode) {
      this.selectedOsFamilies = this.osFamilies.concat();
      this.selectedFilters = this.categoryFilters.concat();
    }
  }

  public showAccountFilter(): boolean {
    return this.authService.isAdmin();
  }

  public ngOnChanges(changes) {
    if (changes.domains) {
      this.domainsMap = this.domains.reduce((m, i) => ({ ...m, [i.id]: i }), {});
    }
  }

  public accountFullDomain(account) {
    const domain = this.domainsMap[account.domainid];
    return domain ? domain.getPath() : '';
  }

  public get templateSwitchPosition(): number {
    return this.showIso ? this.isoTabIndex : this.templateTabIndex;
  }

  public setMode(index: number): void {
    this.showIso = Number(index) === this.isoTabIndex;
    this.updateDisplayMode();
  }

  public updateDisplayMode(): void {
    const mode = this.showIso ? 'Iso' : 'Template';
    this.displayMode.emit(mode);
  }

  public updateSelectedGroupings(selectedGroupings) {
    this.selectedGroupingsChange.emit(selectedGroupings);
  }

}
