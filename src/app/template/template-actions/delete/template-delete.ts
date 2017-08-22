import { Injectable } from '@angular/core';
import { BaseTemplateDeleteAction } from './base-template-delete';
import { Observable } from 'rxjs/Observable';
import { Template } from '../../shared/template.model';
import { DialogService } from '../../../dialog/dialog-module/dialog.service';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { TemplateService } from '../../shared/template.service';


@Injectable()
export class TemplateDeleteAction extends BaseTemplateDeleteAction {
  protected confirmMessage = 'DIALOG_MESSAGE.TEMPLATE.CONFIRM_DELETION';
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

  protected remove(template: Template): Observable<void> {
    this.notificationId = this.jobsNotificationService.add(this.progressMessage);
    return this.templateService.remove(template);
  }
}
