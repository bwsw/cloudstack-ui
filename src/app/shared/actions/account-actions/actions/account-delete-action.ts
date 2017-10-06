import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { BaseAccountAction } from './base-account-action';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account.model';


@Injectable()
export class AccountDeleteAction extends BaseAccountAction {
  public name = 'ACCOUNT_ACTION.DELETE';
  public icon = 'delete';

  protected confirmMessage = 'DIALOG_MESSAGES.ACCOUNT.CONFIRM_DELETION';
  protected progressMessage = 'JOB_NOTIFICATIONS.ACCOUNT.DELETION_IN_PROGRESS';
  protected successMessage = 'JOB_NOTIFICATIONS.ACCOUNT.DELETION_DONE';
  protected failMessage = 'JOB_NOTIFICATIONS.ACCOUNT.DELETION_FAILED';

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    private accountService: AccountService
  ) {
    super(dialogService, jobsNotificationService);
  }

  protected remove(account: Account): Observable<void> {
    this.notificationId = this.jobsNotificationService.add(this.progressMessage);
    return this.accountService.removeAccount(account);
  }

  public activate(account: Account): Observable<any> {
    return this.dialogService.confirm({ message: this.confirmMessage })
      .onErrorResumeNext()
      .switchMap(res => {
        if (res) {
          return this.onConfirm(account);
        } else {
          return Observable.of(null);
        }
      });
  }

  private onConfirm(account: Account): Observable<any> {
    return this.remove(account)
      .map(() => this.onSuccess())
      .catch(error => {
        this.onError(error);
        return Observable.throw(null);
      });
  }
}
