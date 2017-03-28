import { Component, Inject, OnInit } from '@angular/core';
import { MdlDialogReference } from 'angular2-mdl';
import { ServiceOffering } from '../../shared/models/service-offering.model';
import { VmService } from '../../vm/shared/vm.service';
import { ServiceOfferingFilterService } from '../../shared/services/service-offering-filter.service';
import { VirtualMachine } from '../../vm/shared/vm.model';


@Component({
  selector: 'cs-service-offering-dialog',
  templateUrl: 'service-offering-dialog.component.html',
  styleUrls: ['service-offering-dialog.component.scss'],
})
export class ServiceOfferingDialogComponent implements OnInit {
  public serviceOffering: ServiceOffering;
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
    this.vmService.changeServiceOffering(this.serviceOffering, this.virtualMachine);
    this.dialog.hide();
  }

  public onCancel(): void {
    this.dialog.hide();
  }

  public updateOffering(offering: ServiceOffering): void {
    this.serviceOffering = offering;
  }

  private fetchData(params?: {}): void {
    this.serviceOfferingService.getAvailable(params)
      .subscribe(availableOfferings => {
        this.serviceOfferings = availableOfferings
          .filter(offering => offering.id !== this.virtualMachine.serviceOfferingId);
        if (this.serviceOfferings.length) {
          this.serviceOffering = this.serviceOfferings[0];
        }
      });
  }
}
