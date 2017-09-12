import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { BaseTemplateModel } from '../../../../template/shared/base/base-template.model';
import { TemplateService } from '../../../../template/shared/template/template.service';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { TemplateTagService } from '../../../services/tags/template/template/template-tag.service';
import { BaseTemplateCreateAction } from './base-template-create';
import { Template } from '../../../../template/shared/template/template.model';
import { TemplateCreationData } from './template-creation-params';
import { RegisterTemplateBaseParams } from '../../../../template/shared/base/base-template.service';


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

  protected getCreationCommand(templateCreationData: TemplateCreationData): Observable<Template> {
    const group = templateCreationData.group;
    const creationParams = this.getCreationParams(templateCreationData);

    return this.getRequestObservable(creationParams)
      .switchMap(template => {
        if (group) {
          return this.templateService.addInstanceGroup(template, group);
        } else {
          return Observable.of(template);
        }
      })
      .switchMap(template => {
        return this.templateTagService.setDownloadUrl(template, templateCreationData.url);
      })
      .switchMap(template => this.templateService.get(template.id))
      .do(template => this.templateService.onTemplateCreated.next(template));
  }

  private getRequestObservable(params: RegisterTemplateBaseParams): Observable<Template> {
    if (params.snapshotId) {
      return this.templateService.create(params);
    } else {
      return this.templateService.register(params);
    }
  }

  private getCreationParams(data: TemplateCreationData): RegisterTemplateBaseParams {
    const params = {
      name: this.name,
      displayText: data.displayText,
      osTypeId: data.osTypeId,
      entity: 'Template' as 'Template'
    };

    if (!data.snapshot) {
      params['url'] = data.url;
      params['zoneId'] = data.zoneId;
      params['passwordEnabled'] = data.passwordEnabled;
      params['isDynamicallyScalable'] = data.isDynamicallyScalable;
    } else {
      params['snapshotId'] = data.snapshot.id;
    }

    if (data.group) {
      params['group'] = data.group;
    }

    return params;
  }
}
