import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { BaseTemplateModel } from '../../../../template/shared/base/base-template.model';
import { TemplateService } from '../../../../template/shared/template/template.service';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { TemplateTagService } from '../../../services/tags/template/template/template-tag.service';
import { BaseTemplateCreateAction } from './base-template-create';


@Injectable()
export class TemplateCreateAction extends BaseTemplateCreateAction {
  public progressMessage = 'JOB_NOTIFICATIONS.TEMPLATE.REGISTER_IN_PROGRESS';
  public successMessage = 'JOB_NOTIFICATIONS.TEMPLATE.REGISTER_DONE';
  public failMessage = 'JOB_NOTIFICATIONS.TEMPLATE.REGISTER_FAILED';

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    private templateService: TemplateService,
    private templateTagService: TemplateTagService
  ) {
    super(dialogService, jobsNotificationService);
  }

  protected getCreationCommand(templateData: any): Observable<BaseTemplateModel> {
    // todo: change
    const group = templateData.group;
    if (group) {
      delete templateData.group;
    }

    return this.getRequestObservable(templateData)
      .switchMap(template => {
        if (group) {
          return this.templateTagService.setGroup(template, group);
        } else {
          return Observable.of(template);
        }
      })
      .switchMap(template => {
        return this.templateTagService.setDownloadUrl(template, templateData.url);
      })
      .switchMap(template => this.templateService.get(template.id))
      .do(template => this.templateService.onTemplateCreated.next(template));
  }

  private getRequestObservable(templateData: any): Observable<BaseTemplateModel> {
    if (templateData.snapshotId) {
      return this.templateService.create(templateData);
    } else {
      return this.templateService.register(templateData);
    }
  }
}
