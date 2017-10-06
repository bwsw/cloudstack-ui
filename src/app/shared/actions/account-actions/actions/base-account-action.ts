import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Action } from '../../../interfaces/action.interface';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { Account } from '../../../models/account.model';


@Injectable()
export abstract class BaseAccountAction implements Action<Account> {
  public name: string;
  public icon?: string;
  protected successMessage: string;
  protected failMessage: string;

  protected notificationId;

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService
  ) {}

  public abstract activate(account: Account, params?: {}): Observable<any>;

  public canActivate(account: Account): boolean {
    return true;
  }

  public hidden(account: Account): boolean {
    return false;
  }

  protected onSuccess(): void {
    this.jobsNotificationService.finish({
      id: this.notificationId,
      message: this.successMessage,
    });
  }

  protected onError(error: any): void {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });

    this.jobsNotificationService.fail({
      id: this.notificationId,
      message: this.failMessage,
    });
  }
}
