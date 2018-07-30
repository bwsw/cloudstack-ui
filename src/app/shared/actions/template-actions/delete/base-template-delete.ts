import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseTemplateModel } from '../../../../template/shared/base-template.model';
import { BaseTemplateAction } from '../base-template-action';


@Injectable()
export abstract class BaseTemplateDeleteAction extends BaseTemplateAction {
  public name = 'COMMON.DELETE';
  public icon = 'mdi-delete';

  protected abstract confirmMessage;
  protected abstract progressMessage;
  protected abstract successMessage;
  protected abstract failMessage;
  protected notificationId;

  public activate(template: BaseTemplateModel): Observable<any> {
    return this.dialogService.confirm({ message: this.confirmMessage })
      .onErrorResumeNext()
      .switchMap(res => {
        if (res) {
          return this.onConfirm(template);
        } else {
          return Observable.of(null);
        }
      });
  }

  private onConfirm(template: BaseTemplateModel): Observable<any> {
    return this.remove(template)
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

  protected abstract remove(template: BaseTemplateModel): Observable<any>;
}
