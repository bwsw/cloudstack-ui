import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { JobsNotificationService } from '../../../services/jobs-notification.service';
import { VmService } from '../../../../vm/shared/vm.service';
import { BaseTemplateDeleteAction } from './base-template-delete';
import { BaseTemplateModel, Iso, IsoService } from '../../../../template/shared';

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
    private vmService: VmService,
  ) {
    super(dialogService, jobsNotificationService);
  }

  protected remove(iso: Iso): Observable<BaseTemplateModel> {
    return this.vmService.getListOfVmsThatUseIso(iso).pipe(
      switchMap(vmList => {
        if (vmList.length) {
          return throwError({
            type: 'vmsInUse',
            vms: vmList,
          });
        }
        this.notificationId = this.jobsNotificationService.add(this.progressMessage);
        return this.isoService.remove(iso);
      }),
    );
  }

  protected onError(error: any): void {
    if (error.type === 'vmsInUse') {
      const listOfUsedVms = error.vms.map(vm => vm.name).join(', ');
      this.dialogService.alert({
        message: {
          translationToken: 'ERRORS.ISO.VMS_IN_USE',
          interpolateParams: { vms: listOfUsedVms },
        },
      });
    } else {
      super.onError(error);
    }
  }
}
