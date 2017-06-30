import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Iso } from '../shared/iso.model';
import { OsFamily } from '../../shared/models/os-type.model';
import { TemplateService } from '../shared/template.service';
import { AuthService } from '../../shared/services/auth.service';
import { IsoService } from '../shared/iso.service';
import { ServiceLocator } from '../../shared/services/service-locator';
import { BaseTemplateModel } from '../shared/base-template.model';
import { TemplateFilters } from '../shared/base-template.service';
import { Zone } from '../../shared/models/zone.model';
import sortBy = require('lodash/sortBy');
import { Template } from '../shared/template.model';


interface TemplateSection {
  zoneName: string;
  templates: Array<BaseTemplateModel>;
}

@Component({
  selector: 'cs-template-filter-list',
  templateUrl: 'template-filter-list.component.html',
  styleUrls: ['template-filter-list.component.scss']
})
export class TemplateFilterListComponent implements OnInit {
  @Input() public templates: Array<Template>;
  @Input() public isos: Array<Iso>;

  @Input() public dialogMode = false;
  @Input() public selectedTemplate: BaseTemplateModel;
  @Input() public showDelimiter = true;
  @Input() public showIsoSwitch = true;
  @Input() public showRadio = false;
  @Input() public viewMode: string;
  @Input() public zoneId: string;
  @Output() public deleteTemplate = new EventEmitter();
  @Output() public selectedTemplateChange = new EventEmitter();
  @Output() public viewModeChange = new EventEmitter();

  public fetching = false;
  public query: string;
  public selectedFilters: Array<string> = [];
  public selectedOsFamilies: Array<OsFamily> = [];
  public selectedZones: Array<Zone> = [];
  public visibleTemplateList: Array<BaseTemplateModel> = [];

  public sections: Array<TemplateSection>;

  protected authService = ServiceLocator.injector.get(AuthService);

  public ngOnInit(): void {
    this.updateList();
  }

  public get templateList(): Array<BaseTemplateModel> {
    return this.viewMode === 'Template' ? this.templates : this.isos;
  }

  public updateList(): void {
    debugger;
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
    }

    this.visibleTemplateList = this.filterBySearch(this.filterByCategories(this.templateList));
    if (this.zoneId) {
      this.visibleTemplateList = this.visibleTemplateList
        .filter(template => template.zoneId === this.zoneId || template.crossZones);
    }
    this.updateSections();
  }

  public get noFilteringResults(): boolean {
    if (this.selectedZones && this.selectedZones.length) {
      return !this.sectionsLength;
    } else {
      return !this.visibleTemplateList || !this.visibleTemplateList.length;
    }
  }

  public get anyZoneResults(): boolean {
    return this.selectedZones && this.selectedZones.length && !this.noFilteringResults;
  }

  public removeTemplate(template: Template): void {
    this.deleteTemplate.next(template);
  }

  private get sectionsLength(): number {
    if (!this.sections) {
      return 0;
    }
    return this.sections.reduce((acc, section) => acc + section.templates.length, 0);
  }

  private updateSections(): void {
    if (!this.selectedZones) {
      return;
    }

    this.sections = sortBy(this.selectedZones, 'name')
      .map(zone => {
        return {
          zoneName: zone.name,
          templates: this.visibleTemplateList.filter(template => template.zoneId === zone.id)
        };
      });
  }

  private filterByCategories(templateList: Array<BaseTemplateModel>): Array<BaseTemplateModel> {
    return templateList
      .filter(template => {
        const featuredFilter = !this.selectedFilters.length ||
          this.selectedFilters.includes(TemplateFilters.featured) || !template.isFeatured;
        const selfFilter = !this.selectedFilters.length ||
          this.selectedFilters.includes(TemplateFilters.self) ||
          !(template.account === this.authService.username);
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
}
