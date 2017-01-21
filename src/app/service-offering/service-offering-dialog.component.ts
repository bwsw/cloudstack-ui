import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';
import { VirtualMachine } from '../vm/vm.model';
import { VmService } from '../vm/vm.service';
import { JobsNotificationService, INotificationStatus } from '../shared/services/jobs-notification.service';
import * as UUID from 'uuid';
import { VmUpdateService } from '../shared/services/vm-update.service';
import { ErrorService } from '../shared/services/error.service';
import { NotificationService } from '../shared/notification.service';
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
    private vmUpdateService: VmUpdateService,
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
      if (this.virtualMachine.serviceOfferingId === this.serviceOfferingId) { return }
      this.vmService.changeServiceOffering(this.serviceOfferingId, this.virtualMachine.id)
        .subscribe(result => {
          this.jobNotificationService.add({
            id: UUID.v4(),
            message: strs['OFFERING_CHANGED'],
            status: INotificationStatus.Finished
          });
          this.vmUpdateService.next(result);
        }, error => {
          this.jobNotificationService.add({
            id: UUID.v4(),
            message: strs['OFFERING_CHANGE_FAILED'],
            status: INotificationStatus.Failed
          });
          this.notificationService.error(strs['UNEXPECTED_ERROR']);
        });
    });
  }
}
