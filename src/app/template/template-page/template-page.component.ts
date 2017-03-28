import { Component, ViewChild, OnInit, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';

import { MdlDialogService } from 'angular2-mdl';
import { TranslateService } from 'ng2-translate';

import {
  Iso,
  IsoService,
  TemplateService
} from '../shared';

import { ListService } from '../../shared/components/list/list.service';

import { JobsNotificationService, NotificationService } from '../../shared/services';
import { TemplateCreationComponent } from '../template-creation/template-creation.component';
import { VmService } from '../../vm/shared/vm.service';
import { StorageService } from '../../shared/services/storage.service';
import { TemplateFilterListComponent } from '../template-filter-list/template-filter-list.component';
import { BaseTemplateModel } from '../shared/base-template.model';
import { Template } from '../shared/template.model';


@Component({
  selector: 'cs-template-page',
  templateUrl: 'template-page.component.html',
  providers: [ListService]
})
export class TemplatePageComponent implements OnInit {
  public viewMode: string;
  public selectedTemplate: BaseTemplateModel;

  @HostBinding('class.detail-list-container') public detailListContainer = true;
  @ViewChild(TemplateFilterListComponent) private filterList;

  constructor(
    private dialogService: MdlDialogService,
    private storageService: StorageService,
    private isoService: IsoService,
    private jobNotificationService: JobsNotificationService,
    private listService: ListService,
    private translateService: TranslateService,
    private templateService: TemplateService,
    private notificationService: NotificationService,
    private vmService: VmService
  ) {}

  public ngOnInit(): void {
    this.viewMode = this.storageService.read('templateDisplayMode') || 'Template';
    this.listService.onAction.subscribe(() => this.showCreationDialog());
    this.listService.onSelected.subscribe((template: Template) => this.selectedTemplate = template);
    this.listService.onDeselected.subscribe(() => this.selectedTemplate = null);
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
    let currentMode = this.viewMode === 'Iso' ? 'ISO' : 'TEMPLATE';
    let notificationId = this.jobNotificationService.add(`${currentMode}_REGISTER_IN_PROGRESS`);

    let obs;
    if (currentMode === 'ISO') {
      obs =  this.isoService.register(templateData);
    } else {
      obs = this.templateService.register(templateData);
    }
    obs.subscribe(
      () => {
        this.filterList.updateList();
        this.jobNotificationService.finish({
          id: notificationId,
          message: `${currentMode}_REGISTER_DONE`,
        });
      },
      error => {
        this.notificationService.error(error.message);
        this.jobNotificationService.fail({
          id: notificationId,
          message: `${currentMode}_REGISTER_FAILED`,
        });
      });
  }

  public removeTemplate(template: BaseTemplateModel): void {
    let currentMode = this.viewMode === 'Iso' ? 'ISO' : 'TEMPLATE';
    let notificationId;

    this.dialogService.confirm(`DELETE_${currentMode}_CONFIRM`)
      .switchMap(() => {
        if (template instanceof Template) {
          notificationId = this.jobNotificationService.add('DELETE_TEMPLATE_IN_PROGRESS');
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
            notificationId = this.jobNotificationService.add('DELETE_ISO_IN_PROGRESS');
            return this.isoService.remove(template);
          });
      })
      .subscribe(() => {
        this.filterList.updateList();
        this.jobNotificationService.finish({
          id: notificationId,
          message: `DELETE_${currentMode}_DONE`,
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
          this.jobNotificationService.fail({
            id: notificationId,
            message: `DELETE_${currentMode}_FAILED`,
          });
        }
      });
  }
}
