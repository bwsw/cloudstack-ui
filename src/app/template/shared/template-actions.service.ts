import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../shared/services/dialog/dialog.service';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { NotificationService } from '../../shared/services/notification.service';
import { VmService } from '../../vm/shared/vm.service';
import { BaseTemplateModel } from './base-template.model';
import { Iso } from './iso.model';
import { IsoService } from './iso.service';
import { Template } from './template.model';
import { TemplateService } from './template.service';

@Injectable()
export class TemplateActionsService {
  constructor(
    private dialogService: DialogService,
    private jobNotificationService: JobsNotificationService,
    private notificationService: NotificationService,
    private templateService: TemplateService,
    private isoService: IsoService,
    private vmService: VmService
  ) { }


  public createTemplate(templateData, viewMode): Observable<void> {
    let obs;
    let inProgressTranslation;
    let doneTranslation;
    let failedTranslation;
    if (viewMode === 'Iso') {
      inProgressTranslation = 'ISO_REGISTER_IN_PROGRESS';
      doneTranslation = 'ISO_REGISTER_DONE';
      failedTranslation = 'ISO_REGISTER_FAILED';
      obs = this.isoService.register(templateData);
    } else {
      inProgressTranslation = 'TEMPLATE_REGISTER_IN_PROGRESS';
      doneTranslation = 'TEMPLATE_REGISTER_DONE';
      failedTranslation = 'TEMPLATE_REGISTER_FAILED';
      obs = this.templateService.register(templateData);
    }
    const notificationId = this.jobNotificationService.add(inProgressTranslation);

    return obs.map(() => {
      this.jobNotificationService.finish({
        id: notificationId,
        message: doneTranslation,
      });
    })
      .catch(error => {
        this.notificationService.error(error.errortext);
        this.jobNotificationService.fail({
          id: notificationId,
          message: failedTranslation,
        });
        return Observable.throw(null);
      });
  }

  public removeTemplate(template: BaseTemplateModel): Observable<void> {
    let notificationId;
    const confirmTranslation = template.path === 'iso'
      ? 'DELETE_ISO_CONFIRM'
      : 'DELETE_TEMPLATE_CONFIRM';

    return this.dialogService.confirm(confirmTranslation, 'NO', 'YES')
      .onErrorResumeNext()
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
      .map(() => {
        const doneTranslation = template.path === 'iso'
          ? 'DELETE_ISO_DONE'
          : 'DELETE_TEMPLATE_DONE';
        this.jobNotificationService.finish({
          id: notificationId,
          message: doneTranslation,
        });
      })
      .catch(error => {
        if (!error) {
          return Observable.throw(null);
        }
        if (error.type === 'vmsInUse') {
          const listOfUsedVms = error.vms.map(vm => vm.name).join(', ');
          this.dialogService.alert({
            translationToken: 'DELETE_ISO_VMS_IN_USE',
            interpolateParams: { vms: listOfUsedVms }
          });
        } else {
          const failedTranslation = template.path === 'iso'
            ? 'DELETE_ISO_FAILED'
            : 'DELETE_TEMPLATE_FAILED';

          this.jobNotificationService.fail({
            id: notificationId,
            message: failedTranslation,
          });
        }
        return Observable.throw(null);
      });
  }
}
