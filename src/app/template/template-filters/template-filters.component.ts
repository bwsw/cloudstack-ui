import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { TemplateFilters, TemplateResourceType } from '../shared/base-template.service';
import { Account, Domain, getPath, OsFamily, OsType, TemplateGroup, Zone } from '../../shared/models';
import { NgrxEntities } from '../../shared/interfaces';
import { AuthService } from '../../shared/services/auth.service';
import { reorderAvailableGroupings } from '../../shared/utils/reorder-groupings';
import { Language } from '../../shared/types';


@Component({
  selector: 'cs-template-filters',
  templateUrl: 'template-filters.component.html',
  styleUrls: ['template-filters.component.scss']
})
export class TemplateFiltersComponent implements OnInit {
  @Input() public showIsoSwitch = true;
  @Input() public showIso: boolean;
  @Input() public dialogMode = false;
  @Input() public availableGroupings: Array<any> = [];
  @Input() public accounts: Array<Account> = [];
  @Input() public osTypes: Array<OsType> = [];
  @Input() public zones: Array<Zone>;
  @Input() public domains: NgrxEntities<Domain>;
  @Input() public groups: Array<TemplateGroup>;
  @Input() public selectedAccountIds: string[];
  @Input() public selectedGroupings: any[];
  @Input() public selectedGroups: TemplateGroup[];
  @Input() public selectedZones: Zone[];
  @Input() public selectedTypes: any[];
  @Input() public selectedOsFamilies: OsFamily[];
  @Input() public query: string;
  @Input() public viewMode: string;

  @Output() public queries = new EventEmitter();
  @Output() public viewModeChange = new EventEmitter();
  @Output() public filters = new EventEmitter();
  @Output() public selectedAccountsChange = new EventEmitter();
  @Output() public selectedGroupingsChange = new EventEmitter();
  @Output() public selectedZonesChange = new EventEmitter();
  @Output() public selectedOsFamiliesChange = new EventEmitter();
  @Output() public selectedTypesChange = new EventEmitter();
  @Output() public selectedGroupsChange = new EventEmitter();
  @Output() public queryChange = new EventEmitter();

  public filterTranslations = {
    [TemplateFilters.self]: 'TEMPLATE_PAGE.FILTERS.SELF',
    [TemplateFilters.featured]: 'TEMPLATE_PAGE.FILTERS.FEATURED',
    [TemplateFilters.community]: 'TEMPLATE_PAGE.FILTERS.COMMUNITY',
  };

  public osFamilies: Array<OsFamily> = [
    OsFamily.Linux,
    OsFamily.Windows,
    OsFamily.MacOs,
    OsFamily.Other
  ];

  public categoryFilters = [
    TemplateFilters.self,
    TemplateFilters.featured,
    TemplateFilters.community
  ];

  constructor(
    private authService: AuthService,
    private translate: TranslateService
  ) {
  }

  public ngOnInit(): void {
    if (this.dialogMode) {
      if (!this.selectedOsFamilies || !this.selectedOsFamilies.length) {
        this.selectedOsFamilies = this.osFamilies.concat();
      }
      if (!this.selectedTypes || !this.selectedTypes.length) {
        this.selectedTypes = this.categoryFilters.concat();
      }
    }

    if (this.availableGroupings && this.selectedGroupings) {
      this.availableGroupings = reorderAvailableGroupings(this.availableGroupings, this.selectedGroupings);
    }
  }

  public get locale(): Language {
    return this.translate.currentLang as Language;
  }

  public get TemplateResourceType() {
    return TemplateResourceType;
  }

  public showAccountFilter(): boolean {
    return this.authService.isAdmin();
  }

  public accountFullDomain(account) {
    const domain = this.domains[account.domainid];
    return domain ? getPath(domain) : '';
  }

  public setMode(mode: string): void {
    this.viewModeChange.emit(mode);
  }

  public updateSelectedGroupings(selectedGroupings) {
    this.selectedGroupingsChange.emit(selectedGroupings);
  }
}
