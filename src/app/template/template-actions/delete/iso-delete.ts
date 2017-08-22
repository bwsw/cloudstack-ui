import { Injectable } from '@angular/core';
import { BaseTemplateDeleteAction } from './base-template-delete';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../dialog/dialog-module/dialog.service';
import { JobsNotificationService } from '../../../shared/services/jobs-notification.service';
import { IsoService } from '../../shared/iso.service';
import { VmService } from '../../../vm/shared/vm.service';
import { Iso } from '../../shared/iso.model';


@Injectable()
export class IsoDeleteAction extends BaseTemplateDeleteAction {
  protected confirmMessage = 'DIALOG_MESSAGE.ISO.CONFIRM_DELETION';
  protected progressMessage = 'JOB_NOTIFICATIONS.ISO.DELETION_IN_PROGRESS';
  protected successMessage = 'JOB_NOTIFICATIONS.ISO.DELETION_DONE';
  protected failMessage = 'JOB_NOTIFICATIONS.ISO.DELETION_FAILED';

  constructor(
    protected dialogService: DialogService,
    protected jobsNotificationService: JobsNotificationService,
    private isoService: IsoService,
    private vmService: VmService
  ) {
    super(dialogService, jobsNotificationService);
  }

  protected remove(iso: Iso): Observable<void> {
    return this.vmService.getListOfVmsThatUseIso(iso)
      .switchMap(vmList => {
        if (vmList.length) {
          return Observable.throw({
            type: 'vmsInUse',
            vms: vmList
          });
        }
        this.notificationId = this.jobsNotificationService.add(this.progressMessage);
        return this.isoService.remove(iso);
      });
  }

  protected onError(error: any): void {
    if (error.type === 'vmsInUse') {
      const listOfUsedVms = error.vms.map(vm => vm.name).join(', ');
      this.dialogService.alert({
        translationToken: 'DELETE_ISO_VMS_IN_USE',
        interpolateParams: { vms: listOfUsedVms }
      });
    } else {
      super.onError(error);
    }
  }
}
