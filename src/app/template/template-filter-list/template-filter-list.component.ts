import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { OsFamily } from '../../shared/models/os-type.model';
import { Zone } from '../../shared/models/zone.model';
import { AuthService } from '../../shared/services/auth.service';
import { ServiceLocator } from '../../shared/services/service-locator';
import { BaseTemplateModel } from '../shared/base-template.model';
import { TemplateFilters } from '../shared/base-template.service';
import { Iso } from '../shared/iso.model';
import { IsoService } from '../shared/iso.service';
import { Template } from '../shared/template.model';
import { TemplateService } from '../shared/template.service';


@Component({
  selector: 'cs-template-filter-list',
  templateUrl: 'template-filter-list.component.html',
  styleUrls: ['template-filter-list.component.scss']
})
export class TemplateFilterListComponent implements OnInit {
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
  public templateList: Array<BaseTemplateModel> = [];
  public visibleTemplateList: Array<BaseTemplateModel> = [];

  public selectedGroupings = [];
  public groupings = [
    {
      key: 'zones',
      label: 'GROUP_BY.ZONES',
      selector: (item: BaseTemplateModel) => item.zoneId || '',
      name: (item: BaseTemplateModel) => item.zoneName || 'NO_ZONE'
    }
  ];

  protected templateService = ServiceLocator.injector.get(TemplateService);
  protected authService = ServiceLocator.injector.get(AuthService);
  protected isoService = ServiceLocator.injector.get(IsoService);

  public ngOnInit(): void {
    this.updateList();
  }

  public changeViewMode(mode: string): void {
    this.viewMode = mode;
    this.updateList();
    this.viewModeChange.emit(this.viewMode);
  }

  public updateList(): void {
    this.fetchData(this.viewMode)
      .subscribe(() => this.filterResults());
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
      this.selectedGroupings = filters.groupings.reduce((acc, g) => {
        acc.push(this.groupings.find(_ => _ === g));
        return acc;
      }, []);
    }

    this.visibleTemplateList = this.filterByZone(this.templateList);
    this.visibleTemplateList = this.filterBySearch(this.filterByCategories(this.visibleTemplateList));
    if (this.zoneId) {
      this.visibleTemplateList = this.visibleTemplateList
        .filter(template => template.zoneId === this.zoneId || template.crossZones);
    }
  }

  public removeTemplate(template: Template): void {
    this.deleteTemplate.next(template);
  }

  private fetchData(mode: string): Observable<any> {
    this.fetching = true;
    if (mode === 'Template') {
      this.templateList = [];

      const selfFilter = this.dialogMode ? TemplateFilters.selfExecutable : TemplateFilters.self;
      return this.templateService.getGroupedTemplates({}, [TemplateFilters.featured, selfFilter])
        .map(templates => {
          let t = [];
          for (const filter in templates) {
            if (templates.hasOwnProperty(filter)) {
              t = t.concat(templates[filter]);
            }
          }
          this.templateList = t;
          this.visibleTemplateList = this.templateList;
          this.fetching = false;
        });
    } else {
      this.templateList = [];
      let params;
      let selfFilter;
      if (this.dialogMode) {
        params = { bootable: true };
        selfFilter = TemplateFilters.selfExecutable;
      } else {
        selfFilter = TemplateFilters.self;
      }
      return Observable.forkJoin([
        this.isoService.getList(Object.assign({}, params, { filter: TemplateFilters.featured })),
        this.isoService.getList(Object.assign({}, params, { filter: selfFilter })),
      ])
        .map(([featuredIsos, selfIsos]) => {
          this.templateList = (featuredIsos as Array<Iso>).concat(selfIsos as Array<Iso>);
          this.visibleTemplateList = this.templateList;
          this.fetching = false;
        });
    }
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

  private filterByZone(templateList: Array<BaseTemplateModel>): Array<BaseTemplateModel> {
    return (!this.selectedZones || !this.selectedZones.length)
      ? templateList
      : templateList.filter(template =>
        this.selectedZones.some(zone => template.zoneId === zone.id)
      );
  }
}
