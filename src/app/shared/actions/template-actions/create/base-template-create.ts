import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseTemplateModel } from '../../../../template/shared/base/base-template.model';
import { BaseTemplateAction } from '../base-template-action';


@Injectable()
export abstract class BaseTemplateCreateAction extends BaseTemplateAction {
  public name = 'CREATE';

  protected abstract progressMessage;
  protected abstract successMessage;
  protected abstract failMessage;
  protected notificationId;

  public activate(templateData: any): Observable<void> {
    this.notificationId = this.jobsNotificationService.add(this.progressMessage);
    return this.getCreationCommand(templateData)
      .do(() => this.onSuccess())
      .catch(error => {
        this.onError(error);
        return Observable.throw(null);
      });
  }

  protected abstract getCreationCommand(templateData): Observable<BaseTemplateModel>;

  private onSuccess(): void {
    this.jobsNotificationService.finish({
      id: this.notificationId,
      message: this.successMessage,
    });
  }

  private onError(error: any): void {
    this.dialogService.alert({
      message: {
        translationToken: error.message,
        interpolateParams: error.params
      }
    });

    this.jobsNotificationService.fail({
      id: this.notificationId,
      message: this.failMessage
    });
  }
}
