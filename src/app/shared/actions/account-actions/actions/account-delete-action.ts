import { Injectable } from '@angular/core';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { BaseAccountAction } from './base-account-action';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';


@Injectable()
export class AccountDeleteAction extends BaseAccountAction {
  public name = 'ACCOUNT_ACTION.DELETE';
  public command = 'delete';
  public icon = 'delete';

  protected confirmMessage = 'DIALOG_MESSAGES.ACCOUNT.CONFIRM_DELETION';
  protected progressMessage = 'JOB_NOTIFICATIONS.ACCOUNT.DELETION_IN_PROGRESS';
  protected successMessage = 'JOB_NOTIFICATIONS.ACCOUNT.DELETION_DONE';
  protected failMessage = 'JOB_NOTIFICATIONS.ACCOUNT.DELETION_FAILED';

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
  ) {
    super(dialogService, jobsNotificationService);
  }

}
