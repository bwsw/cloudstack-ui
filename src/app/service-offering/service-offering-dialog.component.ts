import { Component, Inject } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';
import { VirtualMachine } from '../vm/vm.model';
import { VmService } from '../vm/vm.service';


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
    private vmService: VmService
  ) {}

  public onChange(): void {
    this.vmService.changeServiceOffering(this.serviceOfferingId, this.virtualMachine);
    this.dialog.hide();
  }

  public onCancel(): void {
    this.dialog.hide();
  }
}
