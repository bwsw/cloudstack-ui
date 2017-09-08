import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { BaseTemplateModel } from '../../../../template/shared/base/base-template.model';
import { TemplateService } from '../../../../template/shared/template/template.service';
import { BaseTemplateCreateAction } from './base-template-create';


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
