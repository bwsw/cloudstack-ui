import { Injectable } from '@angular/core';
import { BaseTemplateDeleteAction } from './base-template-delete';
import { Observable } from 'rxjs';

import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { BaseTemplateModel, TemplateService } from '../../../../template/shared';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';

@Injectable()
export class TemplateDeleteAction extends BaseTemplateDeleteAction {
  protected confirmMessage = 'DIALOG_MESSAGES.TEMPLATE.CONFIRM_DELETION';
  protected progressMessage = 'NOTIFICATIONS.TEMPLATE.DELETION_IN_PROGRESS';
  protected successMessage = 'NOTIFICATIONS.TEMPLATE.DELETION_DONE';
  protected failMessage = 'NOTIFICATIONS.TEMPLATE.DELETION_FAILED';

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    private templateService: TemplateService,
  ) {
    super(dialogService, jobsNotificationService);
  }

  protected remove(template: BaseTemplateModel): Observable<BaseTemplateModel> {
    this.notificationId = this.jobsNotificationService.add(this.progressMessage);
    return this.templateService.remove(template);
  }
}
