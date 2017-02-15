import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Template } from '../shared/template.model';
import { Iso } from '../shared/iso.model';
import { Observable } from 'rxjs';
import { OsFamily } from '../../shared/models/os-type.model';
import { TemplateService } from '../shared/template.service';
import { AuthService } from '../../shared/services/auth.service';
import { IsoService } from '../shared/iso.service';
import { ServiceLocator } from '../../shared/services/service-locator';


@Component({
  selector: 'cs-template-filter-list',
  templateUrl: 'template-filter-list.component.html',
  styleUrls: ['template-filter-list.component.scss']
})
export class TemplateFilterListComponent implements OnInit {
  @Input() public selectedTemplate: Template | Iso;
  @Input() public showDelimiter = true;
  @Input() public showIsoSwitch = true;
  @Input() public showRadio = false;
  @Input() public viewMode: string;
  @Output() public selectedTemplateChange = new EventEmitter();
  @Output() public viewModeChange = new EventEmitter();

  public query: string;
  public selectedFilters: Array<string>;
  public selectedOsFamilies: Array<OsFamily>;
  public templateList: Array<Template | Iso>;
  public visibleTemplateList: Array<Template | Iso>;

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
    this.fetchData(this.viewMode);
  }

  public selectTemplate(template: Template | Iso): void {
    this.selectedTemplate = template;
    this.selectedTemplateChange.emit(this.selectedTemplate);
  }

  public filterResults(filters?: any): void {
    if (filters) {
      this.selectedOsFamilies = filters.selectedOsFamilies;
      this.selectedFilters = filters.selectedFilters;
      this.query = filters.query;
    }
    this.visibleTemplateList = this.filterBySearch(this.filterByCategories(this.templateList));
  }

  private fetchData(mode: string): void {
    if (mode === 'template') {
      this.templateList = [];
      this.templateService.getGroupedTemplates({}, ['featured', 'self'])
        .subscribe(templates => {
          let t = [];
          for (let filter in templates) {
            if (templates.hasOwnProperty(filter)) {
              t = t.concat(templates[filter]);
            }
          }
          this.templateList = t;
          this.visibleTemplateList = this.templateList;
        });
    } else {
      this.templateList = [];
      Observable.forkJoin([
        this.isoService.getList({ isofilter: 'featured' }),
        this.isoService.getList({ isofilter: 'self' }),
      ])
        .subscribe(([featuredIsos, selfIsos]) => {
          this.templateList = (featuredIsos as Array<Iso>).concat(selfIsos as Array<Iso>);
          this.visibleTemplateList = this.templateList;
        });
    }
  }

  private filterByCategories(templateList: Array<Template | Iso>): Array<Template | Iso> {
    return templateList
      .filter(template => {
        let featuredFilter = this.selectedFilters.includes('featured') || !template.isFeatured;
        let selfFilter = this.selectedFilters.includes('self') ||
          !(template.account === this.authService.username);
        let osFilter = this.selectedOsFamilies.includes(template.osType.osFamily);
        return featuredFilter && selfFilter && osFilter;
      });
  }

  private filterBySearch(templateList: Array<Template | Iso>): Array<Template | Iso> {
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
