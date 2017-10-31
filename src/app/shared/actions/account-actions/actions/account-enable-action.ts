import { Injectable } from '@angular/core';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { BaseAccountAction } from './base-account-action';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { Account } from '../../../models/account.model';


@Injectable()
export class AccountEnableAction extends BaseAccountAction {
  public name = 'ACCOUNT_ACTION.ENABLE';
  public command = 'enable';
  public icon = 'remove_circle_outline';

  protected confirmMessage = 'DIALOG_MESSAGES.ACCOUNT.CONFIRM_ENABLE';
  protected progressMessage = 'JOB_NOTIFICATIONS.ACCOUNT.ENABLE_IN_PROGRESS';
  protected successMessage = 'JOB_NOTIFICATIONS.ACCOUNT.ENABLE_DONE';
  protected failMessage = 'JOB_NOTIFICATIONS.ACCOUNT.ENABLE_FAILED';

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
  ) {
    super(dialogService, jobsNotificationService);
  }

  public canActivate(account: Account): boolean {
    return account.state !== 'enabled';
  }
}
