import { Component, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import {
  Iso,
  IsoService,
  TemplateService
} from '../shared';
import { INotificationStatus, JobsNotificationService, NotificationService } from '../../shared/services';
import { TemplateCreationComponent } from '../template-creation/template-creation.component';
import { VmService } from '../../vm/shared/vm.service';
import { StorageService } from '../../shared/services/storage.service';
import { TemplateFilterListComponent } from '../template-filter-list/template-filter-list.component';
import { BaseTemplateModel } from '../shared/base-template.model';
import { Template } from '../shared/template.model';


@Component({
  selector: 'cs-template-page',
  templateUrl: 'template-page.component.html',
  styleUrls: ['template-page.component.scss'],
  host: {
    '[class.detail-list-container]': 'true'
  }
})
export class TemplatePageComponent implements OnInit {
  public isDetailOpen: boolean;
  public _viewMode: string;
  public _selectedTemplate: BaseTemplateModel;

  @ViewChild(TemplateFilterListComponent) private filterList;

  constructor(
    private dialogService: MdlDialogService,
    private storageService: StorageService,
    private isoService: IsoService,
    private jobNotificationService: JobsNotificationService,
    private translateService: TranslateService,
    private templateService: TemplateService,
    private notificationService: NotificationService,
    private vmService: VmService
  ) {}

  public ngOnInit(): void {
    this.viewMode = this.storageService.read('templateDisplayMode') || 'Template';
  }

  public get selectedTemplate(): BaseTemplateModel {
    return this._selectedTemplate;
  }

  public set selectedTemplate(template: BaseTemplateModel) {
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
      classes: 'template-creation-dialog',
      providers: [{ provide: 'mode', useValue: this.viewMode }]
    })
      .switchMap(res => res.onHide())
      .subscribe(isoData => {
        if (isoData) {
          this.createTemplate(isoData);
        }
      });
  }

  public createTemplate(templateData): void {
    let translatedStrings;
    let notificationId;

    let currentMode = this.viewMode === 'Iso' ? 'ISO' : 'TEMPLATE';

    this.translateService.get([
      'ISO_REGISTER_IN_PROGRESS',
      'ISO_REGISTER_DONE',
      'ISO_REGISTER_FAILED',
      'TEMPLATE_REGISTER_IN_PROGRESS',
      'TEMPLATE_REGISTER_DONE',
      'TEMPLATE_REGISTER_FAILED'
    ])
      .switchMap(strs => {
        translatedStrings = strs;
        notificationId = this.jobNotificationService.add(
          translatedStrings[`${currentMode}_REGISTER_IN_PROGRESS`]
        );
        if (currentMode === 'ISO') {
          return this.isoService.register(templateData);
        }
        return this.templateService.register(templateData);
      })
      .subscribe(() => {
        this.filterList.updateList();
        this.jobNotificationService.add({
          id: notificationId,
          message: translatedStrings[`${currentMode}_REGISTER_DONE`],
          status: INotificationStatus.Finished
        });
      }, error => {
        this.notificationService.error(error.json()['registerisoresponse']['errortext']);
        this.jobNotificationService.add({
          id: notificationId,
          message: translatedStrings[`${currentMode}_REGISTER_FAILED`],
          status: INotificationStatus.Failed
        });
      });
  }

  public removeTemplate(template: BaseTemplateModel): void {
    let translatedStrings;
    let notificationId;

    let currentMode = this.viewMode === 'Iso' ? 'ISO' : 'TEMPLATE';

    this.translateService.get([
      'DELETE_ISO_IN_PROGRESS',
      'DELETE_ISO_DONE',
      'DELETE_ISO_FAILED',
      'DELETE_ISO_CONFIRM',
      'DELETE_TEMPLATE_IN_PROGRESS',
      'DELETE_TEMPLATE_DONE',
      'DELETE_TEMPLATE_FAILED',
      'DELETE_TEMPLATE_CONFIRM'
    ])
      .switchMap(strs => {
        translatedStrings = strs;
        return this.dialogService.confirm(translatedStrings[`DELETE_${currentMode}_CONFIRM`]);
      })
      .switchMap(() => {
        if (template instanceof Template) {
          notificationId = this.jobNotificationService.add(
            translatedStrings['DELETE_TEMPLATE_IN_PROGRESS']
          );
          return this.templateService.remove(template);
        }
        return this.vmService.getListOfVmsThatUseIso(template as Iso)
          .switchMap(vmList => {
            if (vmList.length) {
              return Observable.throw({
                type: 'vmsInUse',
                vms: vmList
              });
            }
            notificationId = this.jobNotificationService.add(
              translatedStrings['DELETE_ISO_IN_PROGRESS']
            );
            return this.isoService.remove(template);
          });
      })
      .subscribe(() => {
        this.filterList.updateList();
        this.jobNotificationService.add({
          id: notificationId,
          message: translatedStrings[`DELETE_${currentMode}_DONE`],
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
            message: translatedStrings[`DELETE_${currentMode}_FAILED`],
            status: INotificationStatus.Failed
          });
        }
      });
  }
}
