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


@Component({
  selector: 'cs-template-filter-list-selector',
  templateUrl: 'template-filter-list-selector.component.html',
  styleUrls: ['template-filter-list-selector.component.scss']
})
export class TemplateFilterListSelectorComponent implements OnChanges {
  @Input() public templates: Array<Template>;
  @Input() public isos: Array<Iso>;

  @Input() public dialogMode = true;
  @Input() public selectedTemplate: BaseTemplateModel;
  @Input() public showIsoSwitch = true;
  @Input() public viewMode: string;
  @Input() public zoneId: string;
  @Output() public selectedTemplateChange = new EventEmitter();
  @Output() public viewModeChange = new EventEmitter();

  public fetching = false;
  public query: string;
  public selectedFilters: Array<string> = [];
  public selectedOsFamilies: Array<OsFamily> = [];
  public selectedZones: Array<Zone> = [];
  public visibleTemplateList: Array<BaseTemplateModel> = [];

  public selectedGroupings = [];
  public groupings = [
    {
      key: 'zones',
      label: 'GROUP_BY_ZONES',
      selector: (item: BaseTemplateModel) => item.zoneId || '',
      name: (item: BaseTemplateModel) => item.zoneName || 'NO_ZONE'
    }
  ];

  constructor(protected authService: AuthService) {}

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['isos']) {
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

  public selectTemplate(template: BaseTemplateModel): void {
    this.selectedTemplate = template;
    this.selectedTemplateChange.emit(this.selectedTemplate);
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
      this.selectedGroupings = filters.groupings
        .map(g => this.groupings.find(_ => _ === g))
        .filter(g => g);
    }

    this.visibleTemplateList = this.filterByZone(this.templateList);
    this.visibleTemplateList = this.filterBySearch(this.filterByCategories(this.visibleTemplateList));
    if (this.zoneId) {
      this.visibleTemplateList = this.visibleTemplateList
        .filter(template => template.zoneId === this.zoneId || template.crossZones);
    }
  }

  private filterByCategories(templateList: Array<BaseTemplateModel>): Array<BaseTemplateModel> {
    return templateList
      .filter(template => {
        const featuredFilter = !this.selectedFilters.length ||
          this.selectedFilters.includes(TemplateFilters.featured) || !template.isFeatured;
        const selfFilter = !this.selectedFilters.length ||
          this.selectedFilters.includes(TemplateFilters.self) ||
          !(template.account === this.authService.user.username);
        const osFilter = !this.selectedOsFamilies.length ||
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
}
