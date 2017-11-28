import { Injectable } from '@angular/core';
import { BaseTemplateDeleteAction } from './base-template-delete';
import { Observable } from 'rxjs/Observable';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { TemplateService } from '../../../../template/shared/template.service';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { BaseTemplateModel } from '../../../../template/shared/base-template.model';


@Injectable()
export class TemplateDeleteAction extends BaseTemplateDeleteAction {
  protected confirmMessage = 'DIALOG_MESSAGES.TEMPLATE.CONFIRM_DELETION';
  protected progressMessage = 'JOB_NOTIFICATIONS.TEMPLATE.DELETION_IN_PROGRESS';
  protected successMessage = 'JOB_NOTIFICATIONS.TEMPLATE.DELETION_DONE';
  protected failMessage = 'JOB_NOTIFICATIONS.TEMPLATE.DELETION_FAILED';

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    private templateService: TemplateService
  ) {
    super(dialogService, jobsNotificationService);
  }

  protected remove(template: BaseTemplateModel): Observable<BaseTemplateModel> {
    this.notificationId = this.jobsNotificationService.add(this.progressMessage);
    return this.templateService.remove(template);
  }
}
