import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Iso } from '../shared/iso.model';
import { Observable } from 'rxjs/Observable';
import { OsFamily } from '../../shared/models/os-type.model';
import { TemplateService } from '../shared/template.service';
import { AuthService } from '../../shared/services/auth.service';
import { IsoService } from '../shared/iso.service';
import { ServiceLocator } from '../../shared/services/service-locator';
import { BaseTemplateModel } from '../shared/base-template.model';


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
  @Output() public selectedTemplateChange = new EventEmitter();
  @Output() public viewModeChange = new EventEmitter();

  public fetching = false;
  public query: string;
  public selectedFilters: Array<string> = [];
  public selectedOsFamilies: Array<OsFamily> = [];
  public templateList: Array<BaseTemplateModel> = [];
  public visibleTemplateList: Array<BaseTemplateModel> = [];

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
      .subscribe(() => {
        this.filterResults();
      });
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
      this.query = filters.query;
    }
    this.visibleTemplateList = this.filterBySearch(this.filterByCategories(this.templateList));
    if (this.zoneId) {
      this.visibleTemplateList = this.visibleTemplateList
        .filter(template => template.zoneId === this.zoneId || template.crossZones);
    }
  }

  private fetchData(mode: string): Observable<any> {
    this.fetching = true;
    if (mode === 'Template') {
      this.templateList = [];
      return this.templateService.getGroupedTemplates({}, ['featured', 'self'])
        .map(templates => {
          let t = [];
          for (let filter in templates) {
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
      return Observable.forkJoin([
        this.isoService.getList({filter: 'featured'}),
        this.isoService.getList({filter: 'self'}),
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
        let featuredFilter = this.selectedFilters.includes('featured') || !template.isFeatured;
        let selfFilter = this.selectedFilters.includes('self') ||
          !(template.account === this.authService.username);
        let osFilter = this.selectedOsFamilies.includes(template.osType.osFamily);
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
