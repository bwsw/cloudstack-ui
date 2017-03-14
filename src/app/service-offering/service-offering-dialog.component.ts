import { Component, Inject, OnInit } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';
import { VirtualMachine } from '../vm/shared/vm.model';
import { VmService } from '../vm/shared/vm.service';
import { ServiceOfferingFilterService } from '../shared/services/service-offering-filter.service';
import { ServiceOffering } from '../shared/models/service-offering.model';


@Component({
  selector: 'cs-service-offering-dialog',
  templateUrl: './service-offering-dialog.component.html',
  styleUrls: ['./service-offering-dialog.component.scss'],
})
export class ServiceOfferingDialogComponent implements OnInit {
  public serviceOfferingId: string;
  public serviceOfferings: Array<ServiceOffering>;

  constructor(
    public dialog: MdlDialogReference,
    @Inject('virtualMachine') public virtualMachine: VirtualMachine,
    private vmService: VmService,
    private serviceOfferingService: ServiceOfferingFilterService
  ) { }

  public ngOnInit(): void {
    this.fetchData({ zoneId: this.virtualMachine.zoneId });
  }

  public onChange(): void {
    this.vmService.changeServiceOffering(this.serviceOfferingId, this.virtualMachine);
    this.dialog.hide();
  }

  public onCancel(): void {
    this.dialog.hide();
  }

  private fetchData(params?: {}): void {
    this.serviceOfferingService.getAvailable(params)
      .subscribe(availableOfferings => {
        this.serviceOfferings = availableOfferings;
      });
  }
}
