import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import { Action } from '../../shared/interfaces/action.interface';
import { JobsNotificationService } from '../../shared/services/jobs-notification.service';
import { BaseTemplateModel } from '../shared/base-template.model';


@Injectable()
export abstract class BaseTemplateAction implements Action<BaseTemplateModel> {
  public name: string;
  public icon?: string;

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService
  ) {}

  public abstract activate(template: BaseTemplateModel, params?: {}): Observable<any>;
}
