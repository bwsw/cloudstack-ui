import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { BaseTemplateModel } from '../../../../template/shared/base/base-template.model';
import { IsoService } from '../../../../template/shared/iso/iso.service';
import { BaseTemplateCreateAction } from './base-template-create';


@Injectable()
export class IsoCreateAction extends BaseTemplateCreateAction {
  public name = 'CREATE';

  protected confirmMessage = 'DIALOG_MESSAGES.ISO.CONFIRM_DELETION';
  protected progressMessage = 'JOB_NOTIFICATIONS.ISO.DELETION_IN_PROGRESS';
  protected successMessage = 'JOB_NOTIFICATIONS.ISO.DELETION_DONE';
  protected failMessage = 'JOB_NOTIFICATIONS.ISO.DELETION_FAILED';

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    private isoService: IsoService
  ) {
    super(dialogService, jobsNotificationService);
  }

  protected getCreationCommand(templateData: any): Observable<BaseTemplateModel> {
    return this.isoService.register(templateData);
  }
}
