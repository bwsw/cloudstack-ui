import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { BaseTemplateModel } from '../../../../template/shared/base/base-template.model';
import { IsoService } from '../../../../template/shared/iso/iso.service';
import { BaseTemplateCreateAction } from './base-template-create';
import { IsoTagService } from '../../../services/tags/template/iso/iso-tag.service';
import { Iso } from '../../../../template/shared/iso/iso.model';


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

  protected getCreationCommand(templateData: any): Observable<BaseTemplateModel> {
    const group = templateData.group;
    if (group) {
      delete templateData.group;
    }

    return this.isoService.register(templateData)
      .switchMap(iso => {
        if (group) {
          return this.isoTagService.setGroup(iso, group);
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
}
