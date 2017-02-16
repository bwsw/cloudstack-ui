import { Component, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import {
  Iso,
  IsoService,
  Template
 } from '../shared';
import { INotificationStatus, JobsNotificationService, NotificationService } from '../../shared/services';
import { TemplateCreationComponent } from '../template-creation/template-creation.component';
import { VmService } from '../../vm/shared/vm.service';
import { StorageService } from '../../shared/services/storage.service';
import { TemplateFilterListComponent } from '../template-filter-list/template-filter-list.component';


@Component({
  selector: 'cs-template-page',
  templateUrl: 'template-page.component.html',
  styleUrls: ['template-page.component.scss']
})
export class TemplatePageComponent implements OnInit {
  public isDetailOpen: boolean;
  public _viewMode: string;
  public _selectedTemplate: Template | Iso;

  @ViewChild(TemplateFilterListComponent) private filterList;

  constructor(
    private dialogService: MdlDialogService,
    private storageService: StorageService,
    private isoService: IsoService,
    private jobNotificationService: JobsNotificationService,
    private translateService: TranslateService,
    private notificationService: NotificationService,
    private vmService: VmService
  ) {}

  public ngOnInit(): void {
    this.viewMode = this.storageService.read('templateDisplayMode');
  }

  public get selectedTemplate(): Template | Iso {
    return this._selectedTemplate;
  }

  public set selectedTemplate(template: Template | Iso) {
    this._selectedTemplate = template;
    this.isDetailOpen = true;
  }

  public get viewMode(): string {
    return this._viewMode;
  }

  public set viewMode(mode: string) {
    this._viewMode = mode;
  }

  public hideDetail(): void {
    this.isDetailOpen = !this.isDetailOpen;
    this._selectedTemplate = null;
  }

  public showCreationDialog(): void {
    this.dialogService.showCustomDialog({
      component: TemplateCreationComponent,
      isModal: true,
      providers: [{ provide: 'mode', useValue: this.viewMode }],
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
        this.filterList.updateList();
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
        this.filterList.updateList();
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
}
