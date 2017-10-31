import { Injectable } from '@angular/core';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { BaseAccountAction } from './base-account-action';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { Account } from '../../../models/account.model';

@Injectable()
export class AccountLockAction extends BaseAccountAction  {
  public name = 'ACCOUNT_ACTION.LOCK';
  public command = 'lock';
  public icon = 'block';

  protected confirmMessage = 'DIALOG_MESSAGES.ACCOUNT.CONFIRM_LOCK';
  protected progressMessage = 'JOB_NOTIFICATIONS.ACCOUNT.LOCK_IN_PROGRESS';
  protected successMessage = 'JOB_NOTIFICATIONS.ACCOUNT.LOCK_DONE';
  protected failMessage = 'JOB_NOTIFICATIONS.ACCOUNT.LOCK_FAILED';

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
  ) {
    super(dialogService, jobsNotificationService);
  }

  public canActivate(account: Account): boolean {
    return account.state !== 'locked';
  }
}
