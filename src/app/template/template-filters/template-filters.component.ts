import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OsFamily, OsType } from '../../shared/models/os-type.model';
import { Zone } from '../../shared/models/zone.model';
import { TemplateFilters } from '../shared/base-template.service';
import { Account } from '../../shared/models/account.model';
import { Domain } from '../../shared/models/domain.model';
import { Dictionary } from '@ngrx/entity/src/models';
import { AuthService } from '../../shared/services/auth.service';
import { TemplateGroup } from '../../shared/models/template-group.model';
import { TranslateService } from '@ngx-translate/core';


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
  @Input() public domains: Dictionary<Domain>;
  @Input() public groups: Array<TemplateGroup>;
  @Input() public selectedAccountIds: string[];
  @Input() public selectedGroupings: any[];
  @Input() public selectedGroups: TemplateGroup[];
  @Input() public selectedZones: Zone[];
  @Input() public selectedTypes: any[];
  @Input() public selectedOsFamilies: OsFamily[];
  @Input() public query: string;

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

  public lang = 'en';

  private templateTabIndex = 0;
  private isoTabIndex = 1;

  constructor(
    private authService: AuthService,
    private translateService: TranslateService
  ) {
  }

  public ngOnInit(): void {
    if (this.dialogMode) {
      this.selectedOsFamilies = this.osFamilies.concat();
      this.selectedTypes = this.categoryFilters.concat();
    }
    this.lang = this.translateService.currentLang;
  }

  public showAccountFilter(): boolean {
    return this.authService.isAdmin();
  }

  public accountFullDomain(account) {
    const domain = this.domains[account.domainid];
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
    this.viewModeChange.emit(mode);
  }

  public updateSelectedGroupings(selectedGroupings) {
    this.selectedGroupingsChange.emit(selectedGroupings);
  }

}
