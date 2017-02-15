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
import { AuthService } from '../../shared/services/auth.service';
import { StorageService } from '../../shared/services/storage.service';
import { ServiceLocator } from '../../shared/services/service-locator';


@Component({
  selector: 'cs-template-page',
  templateUrl: 'template-page.component.html',
  styleUrls: ['template-page.component.scss']
})
export class TemplatePageComponent implements OnInit {
  public isDetailOpen: boolean;
  public selectedTemplate: Template | Iso;

  public showIso: boolean;

  public selectedOsFamilies: Array<OsFamily>;
  public selectedFilters: Array<string>;
  public query: string;

  public templateList: Array<Template | Iso>;
  public visibleTemplateList: Array<Template | Iso>;

  protected dialogService = ServiceLocator.injector.get(MdlDialogService);
  protected isoService = ServiceLocator.injector.get(IsoService);
  protected jobNotificationService = ServiceLocator.injector.get(JobsNotificationService);
  protected translateService = ServiceLocator.injector.get(TranslateService);
  protected templateService = ServiceLocator.injector.get(TemplateService);
  protected notificationService = ServiceLocator.injector.get(NotificationService);
  protected vmService = ServiceLocator.injector.get(VmService);
  protected authService = ServiceLocator.injector.get(AuthService);
  protected storageService = ServiceLocator.injector.get(StorageService);

  public ngOnInit(): void {
    let mode = this.storageService.read('showIso') === 'iso' ? 'iso' : 'template';
    this.showIso = mode === 'iso';
    this.fetchData(mode);
  }

  public hideDetail(): void {
    this.isDetailOpen = !this.isDetailOpen;
    this.selectedTemplate = null;
  }

  public updateDisplayMode(mode: string): void {
    this.fetchData(mode);
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

  public selectTemplate(template: Template | Iso): void {
    this.selectedTemplate = template;
    this.isDetailOpen = true;
  }

  public filterResults(filters?: any): void {
    if (filters) {
      this.selectedOsFamilies = filters.selectedOsFamilies;
      this.selectedFilters = filters.selectedFilters;
      this.query = filters.query;
    }
    this.visibleTemplateList = this.filterBySearch(this.filterByCategories(this.templateList));
  }

  protected fetchData(mode: string): void {
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
        this.isoService.getList({ isoFilter: 'featured' }),
        this.isoService.getList({ isoFilter: 'self' }),
      ])
        .subscribe(([featuredIsos, selfIsos]) => {
          this.templateList = (featuredIsos as Array<Iso>).concat(selfIsos as Array<Iso>);
          this.visibleTemplateList = this.templateList;
        });
    }
  }

  private addIsoToList(iso: Iso): void {
    this.isoService.addOsTypeData(iso)
      .subscribe(isoWithOs => {
        this.templateList.push(isoWithOs);
        this.filterResults();
      });
  }

  private removeIsoFromList(iso: Iso): void {
    this.templateList = this.templateList.filter(listIso => iso.id !== listIso.id);
    this.filterResults();
    if (iso.id === this.selectedTemplate.id) {
      this.selectedTemplate = null;
      this.isDetailOpen = false;
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
