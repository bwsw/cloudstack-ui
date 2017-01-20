import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';
import { VirtualMachine } from '../vm/vm.model';
import { VmService } from '../vm/vm.service';
import { JobsNotificationService, INotificationStatus } from '../shared/services/jobs-notification.service';
import * as UUID from 'uuid';

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
    private jobNotificationService: JobsNotificationService
  ) {}

  public onChange() {
    this.changeServiceOffering(this.serviceOfferingId, this.virtualMachine);
    this.dialog.hide();
  }

  public onCancel() {
    this.dialog.hide();
  }

  private changeServiceOffering(serviceOfferingId: string, virtualMachine: VirtualMachine) {
    this.vmService.changeServiceOffering(this.serviceOfferingId, this.virtualMachine.id)
      .subscribe(result => {
      this.jobNotificationService.add({
        id: UUID.v4(),
        message: 'Offering changed',
        status: INotificationStatus.Finished
      });
    });
  }
}
