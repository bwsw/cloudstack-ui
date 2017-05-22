import { Component, Inject, OnInit } from '@angular/core';
import { MdlDialogReference } from '@angular-mdl/core';
import { ServiceOffering } from '../../shared/models/service-offering.model';
import { VmService } from '../../vm/shared/vm.service';
import { ServiceOfferingFilterService } from '../../shared/services/service-offering-filter.service';
import { VirtualMachine } from '../../vm/shared/vm.model';
import { ZoneService } from '../../shared/services/zone.service';


@Component({
  selector: 'cs-service-offering-dialog',
  templateUrl: 'service-offering-dialog.component.html',
  styleUrls: ['service-offering-dialog.component.scss'],
})
export class ServiceOfferingDialogComponent implements OnInit {
  public serviceOffering: ServiceOffering;
  public serviceOfferings: Array<ServiceOffering>;
  public loading: Boolean;
  constructor(
    public dialog: MdlDialogReference,
    @Inject('virtualMachine') public virtualMachine: VirtualMachine,
    private vmService: VmService,
    private serviceOfferingService: ServiceOfferingFilterService,
    private zoneService: ZoneService
  ) { }

  public ngOnInit(): void {
    this.zoneService.get(this.virtualMachine.zoneId).subscribe(zone => this.fetchData({ zone }));
  }

  public updateOffering(offering: ServiceOffering): void {
    this.serviceOffering = offering;
  }

  public onChange(): void {
    this.loading = true;
    this.vmService.changeServiceOffering(this.serviceOffering, this.virtualMachine)
      .finally(() => this.loading = false)
      .subscribe(() => this.dialog.hide(this.serviceOffering));
  }

  public onCancel(): void {
    this.dialog.hide();
  }

  private fetchData(params?: {}): void {
    this.serviceOfferingService.getAvailable(params)
      .subscribe(availableOfferings => {
        this.serviceOfferings = availableOfferings.filter(offering => {
          return offering.id !== this.virtualMachine.serviceOfferingId;
        });
        if (this.serviceOfferings.length) {
          this.serviceOffering = this.serviceOfferings[0];
        }
      });
  }
}
