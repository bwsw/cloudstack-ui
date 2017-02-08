import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

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
import { VmService } from '../../vm/shared/vm.service';


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

  public templateList: Array<Template>;
  public isoList: Array<Iso>;

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

  constructor(
    private dialogService: MdlDialogService,
    private isoService: IsoService,
    private jobNotificationService: JobsNotificationService,
    private translateService: TranslateService,
    private templateService: TemplateService,
    private notificationService: NotificationService,
    private vmService: VmService
  ) {}

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
      .subscribe(iso => {
        this.addIsoToList(iso);
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
    return this.isoService.register(new Iso(isoCreationData), isoCreationData.url);
  }

  public delete(iso: Iso): void {
    let translatedStrings;
    let notificationId;

    this.translateService.get([
      'DELETE_ISO_IN_PROGRESS',
      'DELETE_ISO_DONE',
      'DELETE_ISO_FAILED',
      'DELETE_ISO_CONFIRM'
    ])
      .map(strs => {
        translatedStrings = strs;
      })
      .switchMap(() => {
        return this.dialogService.confirm(translatedStrings['DELETE_ISO_CONFIRM']);
      })
      .switchMap(() => {
        return this.vmService.getListOfVmsThatUseIso(iso);
      })
      .switchMap(vmList => {
        if (vmList.length) {
          return Observable.throw({
            type: 'vmsInUse',
            vms: vmList
          });
        } else {
          notificationId = this.jobNotificationService.add(translatedStrings['DELETE_ISO_IN_PROGRESS']);
          return this.isoService.delete(iso);
        }
      })
      .subscribe(() => {
        this.removeIsoFromList(iso);
        this.jobNotificationService.add({
          id: notificationId,
          message: translatedStrings['DELETE_ISO_DONE'],
          status: INotificationStatus.Finished
        });
      }, error => {
        if (!error) {
          return;
        }
        if (error.type === 'vmsInUse') {
          let listOfUsedVms = error.vms.map(vm => vm.name).join(', ');
          this.translateService.get('DELETE_ISO_VMS_IN_USE', {
            vms: listOfUsedVms
          }).subscribe(str => {
            this.dialogService.alert(str);
          });
        } else {
          this.jobNotificationService.add({
            id: notificationId,
            message: translatedStrings['DELETE_ISO_FAILED'],
            status: INotificationStatus.Failed
          });
        }
      });
  }

  private addIsoToList(iso: Iso): void {
    this.isoService.addOsTypeData(iso)
      .subscribe(iso => this.isoList.push(iso));
  }

  private removeIsoFromList(iso: Iso): void {
    this.isoList = this.isoList.filter(listIso => iso.id !== listIso.id);
    if (iso.id === this.selectedTemplate.id) {
      this.selectedTemplate = null;
      this.isDetailOpen = false;
    }
  }

  public selectTemplate(template: Template | Iso): void {
    this.selectedTemplate = template;
    this.isDetailOpen = true;
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
        });
    } else {
      this.isoList = [];
      // stub
      Observable.forkJoin([
        this.isoService.getList({ isofilter: 'featured' }),
        this.isoService.getList({ isofilter: 'self' }),
      ])
        .subscribe(([featuredIsos, selfIsos]) => this.isoList = featuredIsos.concat(selfIsos));
    }
  }
}
