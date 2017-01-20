import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';


@Component({
  selector: 'cs-service-offering-dialog',
  templateUrl: './service-offering-dialog.component.html',
  styleUrls: ['./service-offering-dialog.component.scss'],
})
export class ServiceOfferingDialogComponent {
  public serviceOfferingId: string;

  constructor(
    private dialog: MdlDialogReference,
    @Inject('virtualMachineId') private virtualMachineId: string
  ) {}

  public onChange() {
    this.changeServiceOffering(this.serviceOfferingId, this.virtualMachineId);
  }

  public onCancel() {
    this.dialog.hide();
  }

  private changeServiceOffering(serviceOfferingId: string, virtualMachineId: string) {
    console.log('change', virtualMachineId, 'to', serviceOfferingId);
  }
}
