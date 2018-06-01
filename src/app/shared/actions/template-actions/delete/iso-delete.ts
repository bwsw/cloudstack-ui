import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { VmService } from '../../../../vm/shared/vm.service';
import { Iso } from '../../../../template/shared/iso.model';
import { IsoService } from '../../../../template/shared/iso.service';
import { BaseTemplateDeleteAction } from './base-template-delete';


@Injectable()
export class IsoDeleteAction extends BaseTemplateDeleteAction {
  protected confirmMessage = 'DIALOG_MESSAGES.ISO.CONFIRM_DELETION';
  protected progressMessage = 'NOTIFICATIONS.ISO.DELETION_IN_PROGRESS';
  protected successMessage = 'NOTIFICATIONS.ISO.DELETION_DONE';
  protected failMessage = 'NOTIFICATIONS.ISO.DELETION_FAILED';

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
        message: {
          translationToken: 'ERRORS.ISO.VMS_IN_USE',
          interpolateParams: { vms: listOfUsedVms }
        }
      });
    } else {
      super.onError(error);
    }
  }
}
