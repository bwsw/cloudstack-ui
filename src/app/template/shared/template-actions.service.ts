import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
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
    private templateService: TemplateService,
    private isoService: IsoService,
    private vmService: VmService
  ) {}

  public createTemplate(templateData, viewMode): Observable<void> {
    let obs;
    let inProgressTranslation;
    let doneTranslation;
    let failedTranslation;
    if (viewMode === 'Iso') {
      inProgressTranslation = 'JOB_NOTIFICATIONS.ISO.REGISTER_IN_PROGRESS';
      doneTranslation = 'JOB_NOTIFICATIONS.ISO.REGISTER_DONE';
      failedTranslation = 'JOB_NOTIFICATIONS.ISO.REGISTER_FAILED';
      obs = this.isoService.register(templateData);
    } else {
      inProgressTranslation = 'JOB_NOTIFICATIONS.TEMPLATE.REGISTER_IN_PROGRESS';
      doneTranslation = 'JOB_NOTIFICATIONS.ISO.REGISTER_DONE';
      failedTranslation = 'JOB_NOTIFICATIONS.ISO.REGISTER_FAILED';

      if (templateData.snapshotId) {
        obs = this.templateService.create(templateData);
      } else {
        obs = this.templateService.register(templateData);
      }
    }
    const notificationId = this.jobNotificationService.add(inProgressTranslation);

    return obs.do(() => {
      this.jobNotificationService.finish({
        id: notificationId,
        message: doneTranslation,
      });
    })
      .catch(error => {
        this.dialogService.alert({
          translationToken: error.message,
          interpolateParams: error.params
        });
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
      ? 'DIALOG_MESSAGES.ISO.CONFIRM_DELETION'
      : 'DIALOG_MESSAGES.TEMPLATE.CONFIRM_DELETION';

    return this.dialogService.confirm(confirmTranslation, 'COMMON.NO', 'COMMON.YES')
      .onErrorResumeNext()
      .switchMap(() => {
        if (template instanceof Template) {
          notificationId = this.jobNotificationService.add('JOB_NOTIFICATIONS.TEMPLATE.DELETION_IN_PROGRESS');
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
            notificationId = this.jobNotificationService.add('JOB_NOTIFICATIONS.ISO.DELETION_IN_PROGRESS');
            return this.isoService.remove(template);
          });
      })
      .map(() => {
        const doneTranslation = template.path === 'iso'
          ? 'JOB_NOTIFICATIONS.ISO.DELETION_DONE'
          : 'JOB_NOTIFICATIONS.TEMPLATE.DELETION_DONE';
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
            translationToken: 'ERRORS.ISO.VMS_IN_USE',
            interpolateParams: { vms: listOfUsedVms }
          });
        } else {
          const failedTranslation = template.path === 'iso'
            ? 'JOB_NOTIFICATIONS.ISO.DELETION_FAILED'
            : 'JOB_NOTIFICATIONS.TEMPLATE.DELETION_FAILED';

          this.jobNotificationService.fail({
            id: notificationId,
            message: failedTranslation,
          });
        }
        return Observable.throw(null);
      });
  }
}
