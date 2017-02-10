import { Component, OnInit, Input } from '@angular/core';
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
import { VmService } from '../../vm/shared/vm.service';
import { AuthService } from '../../shared/services/auth.service';
import { StorageService } from '../../shared/services/storage.service';
import { ServiceLocator } from '../../shared/services/service-locator';

interface IFilters {
  selectedOsFamilies: Array<OsFamily>,
  selectedFilters: Array<string>
}


@Component({
  selector: 'cs-template-list',
  templateUrl: 'template-list.component.html',
  styleUrls: ['template-list.component.scss']
})
export class TemplateListComponent implements OnInit {
  public isDetailOpen: boolean;
  public selectedTemplate: Template | Iso;

  public showIso: boolean;

  public filters: IFilters = { selectedOsFamilies: ['Linux'], selectedFilters: ['Featured'] };

  public templateList: Array<Template | Iso>;
  public visibleTemplateList: Array<Template | Iso>;

  public filterTranslations: {};

  public query: string;

  protected dialogService: MdlDialogService;
  protected isoService: IsoService;
  protected jobNotificationService: JobsNotificationService;
  protected translateService: TranslateService;
  protected templateService: TemplateService;
  protected notificationService: NotificationService;
  protected vmService: VmService;
  protected authService: AuthService;
  protected storageService: StorageService;

  constructor() {
    this.dialogService = ServiceLocator.injector.get(MdlDialogService);
    this.isoService = ServiceLocator.injector.get(IsoService);
    this.jobNotificationService = ServiceLocator.injector.get(JobsNotificationService);
    this.translateService = ServiceLocator.injector.get(TranslateService);
    this.templateService = ServiceLocator.injector.get(TemplateService);
    this.notificationService = ServiceLocator.injector.get(NotificationService);
    this.vmService = ServiceLocator.injector.get(VmService);
    this.authService = ServiceLocator.injector.get(AuthService);
    this.storageService = ServiceLocator.injector.get(StorageService);
  }

  public ngOnInit(): void {
    this.fetchData();
    console.log(this.filters);
    // this.translateService.get(
    //   this.filters.map(filter => `TEMPLATE_${filter.toUpperCase()}`)
    // )
    //   .subscribe(translations => {
    //     const strs = {};
    //     this.filters.forEach(filter => {
    //       strs[filter] = translations[`TEMPLATE_${filter.toUpperCase()}`];
    //     });
    //     this.filterTranslations = strs;
    //   });

    // this.queryStream
    //   .distinctUntilChanged()
    //   .subscribe(query => {
    //     this.filterResults(query);
    //   });

    // this.showIso = this.storageService.read('templateDisplayMode') === 'iso';
    // this.switchDisplayMode();
  }

  public hideDetail(): void {
    this.isDetailOpen = !this.isDetailOpen;
  }

  // public switchDisplayMode(): void {
  //   this.fetchData();
  //   // this.storageService.write('templateDisplayMode', this.showIso ? 'iso' : 'template'); // move to filters
  // }

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
        // this.addIsoToList(iso);
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
        // this.removeIsoFromList(iso);
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

  public selectTemplate(template: Template | Iso): void {
    this.selectedTemplate = template;
    this.isDetailOpen = true;
  }

  public ngOnChanges(): void {
    // this.filterResults(this.query);
    console.log(this.filters);
  }

  private filterResults(query?: string): void {
    this.visibleTemplateList = this.filterBySearch(query, this.filterByCategories(this.templateList));
  }

  // private addIsoToList(iso: Iso): void {
  //   this.isoService.addOsTypeData(iso)
  //     .subscribe(isoWithOs => {
  //       this.templateList.push(isoWithOs);
  //       this.filterResults();
  //     });
  // }
  //
  // private removeIsoFromList(iso: Iso): void {
  //   this.templateList = this.templateList.filter(listIso => iso.id !== listIso.id);
  //   this.filterResults();
  //   if (iso.id === this.selectedTemplate.id) {
  //     this.selectedTemplate = null;
  //     this.isDetailOpen = false;
  //   }
  // }

  private filterByCategories(templateList: Array<Template | Iso>): Array<Template | Iso> {
    debugger;
    return templateList
      .filter(template => {
        let featuredFilter = this.filters.selectedFilters.includes('featured') || !template.isFeatured;
        let selfFilter = this.filters.selectedFilters.includes('self') ||
          !(template.account === this.authService.username);
        let osFilter = this.filters.selectedOsFamilies.includes(template.osType.osFamily);
        return featuredFilter && selfFilter && osFilter;
      });
  }

  private filterBySearch(query: string, templateList: Array<Template | Iso>): Array<Template | Iso> {
    if (!query) {
      return templateList;
    }
    const queryLower = query.toLowerCase();
    return templateList.filter(template => {
      return template.name.toLowerCase().includes(queryLower) ||
        template.displayText.toLowerCase().includes(queryLower);
    });
  }

  private fetchData(): void {
    console.log(this.filters);
    if (!this.showIso) {
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
          this.filterResults(this.query);
        });
    } else {
      this.templateList = [];
      Observable.forkJoin([
        this.isoService.getList({ isofilter: 'featured' }),
        this.isoService.getList({ isofilter: 'self' }),
      ])
        .subscribe(([featuredIsos, selfIsos]) => {
          this.templateList = featuredIsos.concat(selfIsos);
          this.filterResults(this.query);
        });
    }
  }
}
