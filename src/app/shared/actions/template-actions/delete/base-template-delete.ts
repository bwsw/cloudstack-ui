import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, onErrorResumeNext, switchMap } from 'rxjs/operators';

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
    return this.dialogService.confirm({ message: this.confirmMessage }).pipe(
      onErrorResumeNext(),
      switchMap(res => {
        if (res) {
          return this.onConfirm(template);
        }
        return of(null);
      }),
    );
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
        interpolateParams: error.params,
      },
    });

    this.jobsNotificationService.fail({
      id: this.notificationId,
      message: this.failMessage,
    });
  }

  protected abstract remove(template: BaseTemplateModel): Observable<any>;

  private onConfirm(template: BaseTemplateModel): Observable<any> {
    return this.remove(template).pipe(
      map(() => this.onSuccess()),
      catchError(error => {
        this.onError(error);
        return throwError(null);
      }),
    );
  }
}
