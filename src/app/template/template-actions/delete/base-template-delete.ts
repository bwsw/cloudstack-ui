import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseTemplateAction } from '../base-template-action';
import { BaseTemplateModel } from '../../shared/base-template.model';


@Injectable()
export abstract class BaseTemplateDeleteAction extends BaseTemplateAction {
  public name = 'DELETE';
  public icon = 'delete';

  protected abstract confirmMessage;
  protected abstract progressMessage;
  protected abstract successMessage;
  protected abstract failMessage;
  protected notificationId;

  public activate(template: BaseTemplateModel): Observable<any> {
    return this.dialogService.confirm(this.confirmMessage, 'NO', 'YES')
      .onErrorResumeNext()
      .switchMap(() => this.remove(template))
      .map(() => this.onSuccess())
      .catch(error => {
        this.onError(error);
        return Observable.throw(null);
      });
  }

  protected onSuccess(): void {
    this.jobsNotificationService.finish({
      id: this.notificationId,
      message: this.successMessage,
    });
  }

  protected onError(error: any): void {
    this.dialogService.alert({
      translationToken: error.message,
      interpolateParams: error.params
    });

    this.jobsNotificationService.fail({
      id: this.notificationId,
      message: this.failMessage,
    });
  }

  protected abstract remove(template: BaseTemplateModel): Observable<void>;
}
