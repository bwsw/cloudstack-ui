import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

import {OsFamily} from '../../shared/models/os-type.model';
import {Zone} from '../../shared/models/zone.model';
import {AuthService} from '../../shared/services/auth.service';
import {BaseTemplateModel} from '../shared/base-template.model';
import {TemplateFilters} from '../shared/base-template.service';
import {Iso} from '../shared/iso.model';
import {Template} from '../shared/template.model';
import {User} from '../../shared/models/user.model';
import {UserService} from '../../shared/services/user.service';


@Component({
  selector: 'cs-template-filter-list',
  templateUrl: 'template-filter-list.component.html',
  styleUrls: ['template-filter-list.component.scss']
})
export class TemplateFilterListComponent implements OnChanges {
  @Input() public templates: Array<Template>;
  @Input() public isos: Array<Iso>;

  @Input() public showDelimiter = true;
  @Input() public viewMode: string;
  @Input() public zoneId: string;
  @Output() public deleteTemplate = new EventEmitter();
  @Output() public viewModeChange = new EventEmitter();

  public fetching = false;
  public query: string;
  public selectedFilters: Array<string> = [];
  public selectedOsFamilies: Array<OsFamily> = [];
  public selectedZones: Array<Zone> = [];
  public visibleTemplateList: Array<BaseTemplateModel> = [];
  public accounts: Array<User>;
  public userList: Array<User>;

  public selectedGroupings = [];
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
      name: (item: BaseTemplateModel) => this.getUserName(item.account),
    }
  ];

  constructor(protected authService: AuthService, private userService: UserService,) {
    this.getUserList();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['isos'] || changes['templates']) {
      this.updateList();
    }
  }

  public get templateList(): Array<BaseTemplateModel> {
    return this.viewMode === 'Template' ? this.templates : this.isos;
  }

  public updateList(): void {
    this.visibleTemplateList = this.templateList;
    this.filterResults();
  }

  public changeViewMode(mode: string): void {
    this.viewMode = mode;
    this.updateList();
    this.viewModeChange.emit(this.viewMode);
  }

  public filterResults(filters?: any): void {
    if (!this.templateList) {
      return;
    }

    if (filters) {
      this.selectedOsFamilies = filters.selectedOsFamilies;
      this.selectedFilters = filters.selectedFilters;
      this.selectedZones = filters.selectedZones;
      this.query = filters.query;
      this.accounts = filters.accounts;

      if (filters.groupings) {
        this.selectedGroupings = filters.groupings
          .map(g => this.groupings.find(_ => _ === g))
          .filter(g => g);
      }
    }

    this.visibleTemplateList = this.filterByZone(this.templateList);
    this.visibleTemplateList = this.filterBySearch(this.filterByCategories(this.visibleTemplateList));
    if (this.zoneId) {
      this.visibleTemplateList = this.visibleTemplateList
        .filter(template => template.zoneId === this.zoneId || template.crossZones);
    }
    this.visibleTemplateList = this.sortByAccount(this.accounts);
  }

  private getUserList() {
    this.userService.getList().subscribe(users => {
      this.userList = users;
    });
  }

  private getUserName(account: string) {
    let user = this.userList.find(user => user.account === account);
    return user ? user.name: account;
  }

  private filterByCategories(templateList: Array<BaseTemplateModel>): Array<BaseTemplateModel> {
    const username = this.authService.user && this.authService.user.username || '';

    return templateList
      .filter(template => {
        const featuredFilter = !this.selectedFilters || !this.selectedFilters.length ||
          this.selectedFilters.includes(TemplateFilters.featured) || !template.isFeatured;
        const selfFilter = !this.selectedFilters || !this.selectedFilters.length ||
          this.selectedFilters.includes(TemplateFilters.self) ||
          !(template.account === username);
        const osFilter = !this.selectedOsFamilies || !this.selectedOsFamilies.length ||
          this.selectedOsFamilies.includes(template.osType.osFamily);
        return featuredFilter && selfFilter && osFilter;
      });
  }

  private filterBySearch(templateList: Array<BaseTemplateModel>): Array<BaseTemplateModel> {
    if (!this.query) {
      return templateList;
    }
    const queryLower = this.query.toLowerCase();
    return templateList.filter(template => {
      return template.name.toLowerCase().includes(queryLower) ||
        template.displayText.toLowerCase().includes(queryLower);
    });
  }

  private filterByZone(templateList: Array<BaseTemplateModel>): Array<BaseTemplateModel> {
    return (!this.selectedZones || !this.selectedZones.length)
      ? templateList
      : templateList.filter(template =>
        this.selectedZones.some(zone => template.zoneId === zone.id)
      );
  }

  private sortByAccount(accounts) {
    let result: Array<BaseTemplateModel> = [];
    if (accounts && accounts.length != 0) {
      accounts.forEach(account => {
        result = result.concat(this.visibleTemplateList.filter(vm => vm.account === account.account))
      });
      return result;
    } else {
      return this.visibleTemplateList;
    }
  }
}
