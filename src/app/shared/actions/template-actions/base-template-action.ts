import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { Action } from '../../interfaces/action.interface';
import { JobsNotificationService } from '../../services/jobs-notification.service';
import { BaseTemplateModel } from '../../../template/shared/base-template.model';

@Injectable()
export abstract class BaseTemplateAction implements Action<BaseTemplateModel> {
  public name: string;
  public icon?: string;

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
  ) {}

  public abstract activate(template: BaseTemplateModel, params?: {}): Observable<any>;

  public canActivate(template: BaseTemplateModel): boolean {
    return true;
  }

  public hidden(template: BaseTemplateModel): boolean {
    return false;
  }
}
