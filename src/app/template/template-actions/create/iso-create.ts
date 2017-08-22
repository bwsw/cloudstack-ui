import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../dialog/dialog-module/dialog.service';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { BaseTemplateModel } from '../../shared/base-template.model';
import { IsoService } from '../../shared/iso.service';
import { BaseTemplateCreateAction } from './base-template-create';


@Injectable()
export class IsoCreateAction extends BaseTemplateCreateAction {
  public name = 'CREATE';

  protected confirmMessage = 'DELETE_ISO_CONFIRM';
  protected progressMessage = 'DELETE_ISO_IN_PROGRESS';
  protected successMessage = 'DELETE_ISO_DONE';
  protected failMessage = 'DELETE_ISO_FAILED';

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    private isoService: IsoService
  ) {
    super(dialogService, jobsNotificationService);
  }

  protected getCreationCommand(templateData: any): Observable<BaseTemplateModel> {
    return this.isoService.register(templateData);
  }
}
