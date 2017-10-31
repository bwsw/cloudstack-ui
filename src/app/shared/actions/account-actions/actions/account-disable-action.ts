import { Injectable } from '@angular/core';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { BaseAccountAction } from './base-account-action';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { Account } from '../../../models/account.model';

@Injectable()
export class AccountDisableAction extends BaseAccountAction {
  public name = 'ACCOUNT_ACTION.DISABLE';
  public command = 'disable';
  public icon = 'remove_circle';

  protected confirmMessage = 'DIALOG_MESSAGES.ACCOUNT.CONFIRM_DISABLE';
  protected progressMessage = 'JOB_NOTIFICATIONS.ACCOUNT.DISABLE_IN_PROGRESS';
  protected successMessage = 'JOB_NOTIFICATIONS.ACCOUNT.DISABLE_DONE';
  protected failMessage = 'JOB_NOTIFICATIONS.ACCOUNT.DISABLE_FAILED';

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
  ) {
    super(dialogService, jobsNotificationService);
  }

  public canActivate(account: Account): boolean {
    return account.state !== 'disabled';
  }
}
