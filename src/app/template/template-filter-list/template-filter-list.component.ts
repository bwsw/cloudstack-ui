import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

import { OsFamily } from '../../shared/models/os-type.model';
import { Zone } from '../../shared/models/zone.model';
import { AuthService } from '../../shared/services/auth.service';
import { BaseTemplateModel } from '../shared/base-template.model';
import { TemplateFilters } from '../shared/base-template.service';
import { Iso } from '../shared/iso.model';
import { Template } from '../shared/template.model';
import { Domain } from '../../shared/models/domain.model';
import { DomainService } from '../../shared/services/domain.service';
import { Account } from '../../shared/models/account.model';


@Component({
  selector: 'cs-template-filter-list',
  templateUrl: 'template-filter-list.component.html',
  styleUrls: ['template-filter-list.component.scss']
})
export class TemplateFilterListComponent {
  @Input() public templates: Array<Template>;
  @Input() public isos: Array<Iso>;

  @Input() public showDelimiter = true;
  @Input() public viewMode: string;
  @Input() public groupings: object[];
  @Input() public zoneId: string;
  @Output() public deleteTemplate = new EventEmitter();
  @Output() public viewModeChange = new EventEmitter();
  @Output() public onQueryChange = new EventEmitter();
  @Output() public onFiltersChange = new EventEmitter();

  @Input() public fetching = false;
  public query: string;
  public selectedFilters: Array<string> = [];
  public selectedOsFamilies: Array<OsFamily> = [];
  public selectedZones: Array<Zone> = [];
  public visibleTemplateList: Array<BaseTemplateModel> = [];
  public accounts: Array<Account>;
  public domainList: Array<Domain>;

  public selectedGroupings = [];

  constructor(protected authService: AuthService, private domainService: DomainService) {
    if (!this.authService.isAdmin()) {
      this.groupings = this.groupings.filter((g: any) => g.key !== 'accounts');
      this.accounts = [];
    } else {
      // this.getDomainList();
    }
  }

  public changeViewMode(mode: string): void {
    this.viewMode = mode;
    this.viewModeChange.emit(this.viewMode);
  }

  //
  // public filterResults(filters?: any): void {
  //   if (!this.templateList) {
  //     return;
  //   }
  //
  //   if (filters) {
  //     this.selectedOsFamilies = filters.selectedOsFamilies;
  //     this.selectedFilters = filters.selectedFilters;
  //     this.selectedZones = filters.selectedZones;
  //     this.query = filters.query;
  //     this.accounts = filters.accounts;
  //
  //     if (filters.groupings) {
  //       this.selectedGroupings = filters.groupings
  //         .map(g => this.groupings.find(_ => _ === g))
  //         .filter(g => g);
  //     }
  //   }
  //
  //   this.visibleTemplateList = this.filterByZone(this.templateList);
  //   this.visibleTemplateList = this.filterBySearch(this.filterByCategories(this.visibleTemplateList));
  //   if (this.zoneId) {
  //     this.visibleTemplateList = this.visibleTemplateList
  //       .filter(template => template.zoneId === this.zoneId || template.crossZones);
  //   }
  //   this.visibleTemplateList = this.filterByAccount(
  //     this.visibleTemplateList,
  //     this.accounts
  //   );
  // }
  //
  // private getDomainList() {
  //   this.domainService.getList().subscribe(domains => {
  //     this.domainList = domains;
  //   });
  // }
  //
  // private getDomain(domainId: string) {
  //   const domain = this.domainList && this.domainList.find(d => d.id === domainId);
  //   return domain ? domain.getPath() : '';
  // }
  //
  // private filterByCategories(templateList: Array<BaseTemplateModel>): Array<BaseTemplateModel> {
  //   const username = this.authService.user && this.authService.user.username || '';
  //
  //   return templateList
  //     .filter(template => {
  //       const featuredFilter = !this.selectedFilters || !this.selectedFilters.length ||
  //         this.selectedFilters.includes(TemplateFilters.featured) || !template.isFeatured;
  //       const selfFilter = !this.selectedFilters || !this.selectedFilters.length ||
  //         this.selectedFilters.includes(TemplateFilters.self) ||
  //         !(template.account === username);
  //       const osFilter = !this.selectedOsFamilies || !this.selectedOsFamilies.length ||
  //         this.selectedOsFamilies.includes(template.osType.osFamily);
  //       return featuredFilter && selfFilter && osFilter;
  //     });
  // }
  //
  // private filterBySearch(templateList: Array<BaseTemplateModel>): Array<BaseTemplateModel> {
  //   if (!this.query) {
  //     return templateList;
  //   }
  //   const queryLower = this.query.toLowerCase();
  //   return templateList.filter(template => {
  //     return template.name.toLowerCase().includes(queryLower) ||
  //       template.displayText.toLowerCase().includes(queryLower);
  //   });
  // }
  //
  // private filterByZone(templateList: Array<BaseTemplateModel>): Array<BaseTemplateModel> {
  //   return (!this.selectedZones || !this.selectedZones.length)
  //     ? templateList
  //     : templateList.filter(template =>
  //       this.selectedZones.some(zone => template.zoneId === zone.id)
  //     );
  // }
  //
  // private filterByAccount(visibleTemplateList: Array<BaseTemplateModel>, accounts = []) {
  //   return !accounts.length
  //     ? this.visibleTemplateList
  //     : visibleTemplateList.filter(template =>
  //       accounts.find(
  //         account => account.name === template.account && account.domainid === template.domainId));
  // }
}
