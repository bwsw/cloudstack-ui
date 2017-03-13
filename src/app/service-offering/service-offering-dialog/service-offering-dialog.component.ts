import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';
import { VirtualMachine } from '../../vm/shared/vm.model';
import { VmService } from '../../vm/shared/vm.service';
import { ServiceOffering } from '../../shared/models/service-offering.model';


@Component({
  selector: 'cs-service-offering-dialog',
  templateUrl: 'service-offering-dialog.component.html',
  styleUrls: ['service-offering-dialog.component.scss'],
})
export class ServiceOfferingDialogComponent {
  public serviceOffering: ServiceOffering;

  constructor(
    public dialog: MdlDialogReference,
    @Inject('virtualMachine') public virtualMachine: VirtualMachine,
    private vmService: VmService
  ) {}

  public onChange(): void {
    this.vmService.changeServiceOffering(this.serviceOffering, this.virtualMachine);
    this.dialog.hide();
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
