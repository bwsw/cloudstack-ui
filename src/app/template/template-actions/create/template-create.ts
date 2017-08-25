import { Injectable } from '@angular/core';
import { BaseTemplateCreateAction } from './base-template-create';
import { DialogService } from '../../../dialog/dialog-module/dialog.service';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { Observable } from 'rxjs/Observable';
import { BaseTemplateModel } from '../../shared/base-template.model';
import { TemplateService } from '../../shared/template.service';


@Injectable()
export class TemplateCreateAction extends BaseTemplateCreateAction {
  public progressMessage = 'JOB_NOTIFICATIONS.TEMPLATE.REGISTER_IN_PROGRESS';
  public successMessage = 'JOB_NOTIFICATIONS.TEMPLATE.REGISTER_DONE';
  public failMessage = 'JOB_NOTIFICATIONS.TEMPLATE.REGISTER_FAILED';

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    private templateService: TemplateService
  ) {
    super(dialogService, jobsNotificationService);
  }

  protected getCreationCommand(templateData: any): Observable<BaseTemplateModel> {
    if (templateData.snapshotId) {
      return this.templateService.create(templateData);
    } else {
      return this.templateService.register(templateData);
    }
  }
}
