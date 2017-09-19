import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { IsoService } from '../../../../template/shared/iso/iso.service';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { IsoTagService } from '../../../services/tags/template/iso/iso-tag.service';
import { BaseTemplateCreateAction } from './base-template-create';
import { Iso } from '../../../../template/shared/iso/iso.model';
import { IsoCreationData } from './iso-creation-params';
import { RegisterTemplateBaseParams } from '../../../../template/shared/base/base-template.service';


@Injectable()
export class IsoCreateAction extends BaseTemplateCreateAction {
  public name = 'CREATE';

  protected confirmMessage = 'DIALOG_MESSAGES.ISO.CONFIRM_DELETION';
  protected progressMessage = 'JOB_NOTIFICATIONS.ISO.DELETION_IN_PROGRESS';
  protected successMessage = 'JOB_NOTIFICATIONS.ISO.DELETION_DONE';
  protected failMessage = 'JOB_NOTIFICATIONS.ISO.DELETION_FAILED';

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    private isoService: IsoService,
    private isoTagService: IsoTagService
  ) {
    super(dialogService, jobsNotificationService);
  }

  protected getCreationCommand(templateData: IsoCreationData): Observable<Iso> {
    const group = templateData.group;
    const creationParams = this.getCreationParams(templateData);

    return this.isoService.register(creationParams)
      .switchMap(iso => {
        if (group) {
          return this.isoService.addInstanceGroup(iso, group);
        } else {
          return Observable.of(iso);
        }
      })
      .switchMap(iso => {
        return this.isoTagService.setDownloadUrl(iso, templateData.url);
      })
      .switchMap(iso => this.isoService.get(iso.id))
      .do(iso => this.isoService.onTemplateCreated.next(iso));
  }

  private getCreationParams(data: IsoCreationData): RegisterTemplateBaseParams {
    const params = {
      name: this.name,
      displayText: data.displayText,
      osTypeId: data.osTypeId,
      entity: 'Template' as 'Template'
    };

    params['url'] = data.url;
    params['zoneId'] = data.zoneId;

    if (data.group) {
      params['group'] = data.group;
    }

    return params;
  }
}
