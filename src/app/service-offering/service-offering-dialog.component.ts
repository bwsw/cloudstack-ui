import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';
import { VirtualMachine } from '../vm/vm.model';
import { VmService } from '../vm/vm.service';
import { JobsNotificationService, INotificationStatus } from '../shared/services/jobs-notification.service';
import { NotificationService } from '../shared/services/notification.service';
import { TranslateService } from 'ng2-translate';


@Component({
  selector: 'cs-service-offering-dialog',
  templateUrl: './service-offering-dialog.component.html',
  styleUrls: ['./service-offering-dialog.component.scss'],
})
export class ServiceOfferingDialogComponent {
  public serviceOfferingId: string;

  constructor(
    private dialog: MdlDialogReference,
    @Inject('virtualMachine') private virtualMachine: VirtualMachine,
    private vmService: VmService,
    private jobNotificationService: JobsNotificationService,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {}

  public onChange() {
    this.changeServiceOffering(this.serviceOfferingId, this.virtualMachine);
    this.dialog.hide();
  }

  public onCancel() {
    this.dialog.hide();
  }

  private changeServiceOffering(serviceOfferingId: string, virtualMachine: VirtualMachine) {
    this.translateService.get([
      'OFFERING_CHANGED',
      'OFFERING_CHANGE_FAILED',
      'UNEXPECTED_ERROR'
    ]).subscribe(strs => {
      if (virtualMachine.serviceOfferingId === serviceOfferingId) {
        return;
      }
      this.vmService.changeServiceOffering(serviceOfferingId, virtualMachine.id)
        .subscribe(result => {
          this.jobNotificationService.add({
            message: strs['OFFERING_CHANGED'],
            status: INotificationStatus.Finished
          });
          this.vmService.updateVmInfo(result);
        }, () => {
          this.jobNotificationService.add({
            message: strs['OFFERING_CHANGE_FAILED'],
            status: INotificationStatus.Failed
          });
          this.notificationService.error(strs['UNEXPECTED_ERROR']);
        });
    });
  }
}
