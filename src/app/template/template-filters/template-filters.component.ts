import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { OsFamily } from '../../shared/models/os-type.model';
import { Zone } from '../../shared/models/zone.model';
import { FilterService } from '../../shared/services/filter.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { ZoneService } from '../../shared/services/zone.service';
import { TemplateFilters } from '../shared/base-template.service';
import { Account } from '../../shared/models/account.model';
import { AuthService } from '../../shared/services/auth.service';
import { DomainService } from '../../shared/services/domain.service';
import { AccountService } from '../../shared/services/account.service';
import { Observable } from 'rxjs/Observable';


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
  public selectedAccountIds: Array<string> = [];

  public zones: Array<Zone> = [];
  public accounts: Array<Account> = [];
  public selectedZones: Array<Zone> = [];

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

  public filterTranslations = {
    [TemplateFilters.featured]: 'TEMPLATE_PAGE.FILTERS.FEATURED',
    [TemplateFilters.self]: 'TEMPLATE_PAGE.FILTERS.SELF',
  };

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
    groupings: { type: 'array', defaultOption: [] },
    accounts: { type: 'array', defaultOption: [] }
  }, this.router, this.storageService, this.filtersKey, this.activatedRoute);

  private templateTabIndex = 0;
  private isoTabIndex = 1;

  private queryStream = new Subject<string>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: LocalStorageService,
    // private translateService: TranslateService,
    private zoneService: ZoneService,
    private domainService: DomainService,
    private accountService: AccountService,
    private authService: AuthService
  ) {
  }

  public ngOnInit(): void {
    if (!this.dialogMode) {
      const observes = this.showAccountFilter() ? Observable.forkJoin(this.getAccountList(),this.getZones()) :
        Observable.forkJoin(this.getZones());
      observes.subscribe(() => this.initFilters());
    } else {
      this.selectedOsFamilies = this.osFamilies.concat();
      this.selectedFilters = this.categoryFilters.concat();
    }

    this.queryStream
      .distinctUntilChanged()
      .subscribe(query => this.queries.emit(query));
  }

  public get templateSwitchPosition(): number {
    return this.showIso ? this.isoTabIndex : this.templateTabIndex;
  }

  public setMode(index: number): void {
    this.showIso = Number(index) === this.isoTabIndex;
    this.updateDisplayMode();
  }

  public showAccountFilter(): boolean {
    return this.authService.isAdmin();
  }

  public updateFilters(): void {
    this.filters.emit({
      selectedOsFamilies: this.selectedOsFamilies,
      selectedFilters: this.selectedFilters,
      selectedZones: this.selectedZones,
      query: this.query,
      groupings: this.selectedGroupingNames,
      accounts: this.accounts.filter(account => this.selectedAccountIds.find(id => id === account.id))
    });

    if (!this.dialogMode) {
      this.filterService.update({
        query: this.query || null,
        osFamilies: this.selectedOsFamilies,
        categoryFilters: this.selectedFilters,
        zones: this.selectedZones.map(_ => _.id),
        groupings: this.selectedGroupingNames.map(_ => _.key),
        accounts: this.selectedAccountIds
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
    this.selectedAccountIds = params['accounts'];

    this.updateFilters();
  }

  private getAccountList() {
    return Observable.forkJoin(
      this.accountService.getList(),
      this.domainService.getList()
    )
      .map(([accounts, domains]) => {
        this.accounts = accounts;
        this.accounts.map(account => {
          account.fullDomain = domains.find(domain => domain.id === account.domainid).getPath();
          return account;
        });
      });
  }

  private getZones() {
    return this.zoneService.getList()
      .map(zones => {
        this.zones = zones;
      });
  }
}
