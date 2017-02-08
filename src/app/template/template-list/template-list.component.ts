import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import {
  Iso,
  IsoService,
  Template,
  TemplateService,
 } from '../shared';
import { OsFamily } from '../../shared/models/os-type.model';
import { INotificationStatus, JobsNotificationService, NotificationService } from '../../shared/services';
import { TemplateCreationComponent } from '../template-creation/template-creation.component';


@Component({
  selector: 'cs-template-list',
  templateUrl: 'template-list.component.html',
  styleUrls: ['template-list.component.scss']
})
export class TemplateListComponent implements OnInit {
  public isDetailOpen: boolean;
  public selectedTemplate: Template | Iso;

  public showIso: boolean = false;
  public query: string;
  public selectedOsFamilies: Array<OsFamily>;
  public selectedFilters: Array<string>;

  public templateList: Array<Template | Iso>;
  public visibleTemplateList: Array<Template | Iso>;

  public osFamilies: Array<OsFamily> = [
    'Linux',
    'Windows',
    'Mac OS',
    'Other'
  ];

  public filters = [
    'featured',
    'self'
  ];

  public filterTranslations: {};

  private queryStream = new Subject<string>();

  constructor(
    private dialogService: MdlDialogService,
    private isoService: IsoService,
    private jobNotificationService: JobsNotificationService,
    private translateService: TranslateService,
    private templateService: TemplateService,
    private notificationService: NotificationService,
  ) { }

  public ngOnInit(): void {
    this.selectedOsFamilies = this.osFamilies.concat();
    this.selectedFilters = this.filters.concat();

    this.fetchData();
    this.translateService.get(
      this.filters.map(filter => `TEMPLATE_${filter.toUpperCase()}`)
    )
      .subscribe(translations => {
        const strs = {};
        this.filters.forEach(filter => {
          strs[filter] = translations[`TEMPLATE_${filter.toUpperCase()}`];
        });
        this.filterTranslations = strs;
      });

    this.queryStream
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(query => {
        this.filterList(query);
      });
  }

  public hideDetail(): void {
    this.isDetailOpen = !this.isDetailOpen;
  }

  public switchDisplayMode(): void {
    this.fetchData();
  }

  public showCreationDialog(): void {
    this.dialogService.showCustomDialog({
      component: TemplateCreationComponent,
      isModal: true,
      styles: { 'width': '720px', 'overflow': 'visible' },
      clickOutsideToClose: true,
      enterTransitionDuration: 400,
      leaveTransitionDuration: 400
    })
      .switchMap(res => res.onHide())
      .subscribe(isoData => {
        if (isoData) {
          this.createIso(isoData);
        }
      });
  }

  public createIso(isoData): void {
    let translatedStrings;
    let notificationId;

    this.translateService.get([
      'ISO_REGISTER_IN_PROGRESS',
      'ISO_REGISTER_DONE',
      'ISO_REGISTER_FAILED'
    ])
      .switchMap(strs => {
        translatedStrings = strs;
        notificationId = this.jobNotificationService.add(translatedStrings['ISO_REGISTER_IN_PROGRESS']);
        return this.addIso(isoData);
      })
      .subscribe(() => {
        this.jobNotificationService.add({
          id: notificationId,
          message: translatedStrings['ISO_REGISTER_DONE'],
          status: INotificationStatus.Finished
        });
      }, error => {
        this.notificationService.error(error.json()['registerisoresponse']['errortext']);
        this.jobNotificationService.add({
          id: notificationId,
          message: translatedStrings['ISO_REGISTER_FAILED'],
          status: INotificationStatus.Failed
        });
      });
  }

  public addIso(isoCreationData: any): Observable<Iso> {
    return this.isoService.register(new Iso(isoCreationData), isoCreationData.url)
      .map(result => {
        // add iso to list
        return result;
      });
  }

  public selectTemplate(template: Template | Iso): void {
    this.selectedTemplate = template;
    this.isDetailOpen = true;
  }

  public search(e: KeyboardEvent): void {
    this.queryStream.next((e.target as HTMLInputElement).value);
  }

  private filterList(query): void {
    if (!query) {
      this.visibleTemplateList = this.templateList;
      return;
    }
    const queryLower = query.toLowerCase();
    this.visibleTemplateList = this.templateList.filter(template => {
      return template.name.toLowerCase().includes(queryLower) ||
        template.displayText.toLowerCase().includes(queryLower);
    });
  }

  private fetchData(): void {
    if (!this.showIso) {
      this.templateList = [];
      // stub
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
      // stub
      Observable.forkJoin([
        this.isoService.getList({ isofilter: 'featured' }),
        this.isoService.getList({ isofilter: 'self' }),
      ])
        .subscribe(([featuredIsos, selfIsos]) => {
          this.templateList = featuredIsos.concat(selfIsos);
          this.visibleTemplateList = this.templateList;
        });
    }
  }
}
