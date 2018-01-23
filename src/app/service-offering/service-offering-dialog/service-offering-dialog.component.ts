import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServiceOffering } from '../../shared/models/service-offering.model';
import { ResourceStats } from '../../shared/services/resource-usage.service';
import { VirtualMachine } from '../../vm/shared/vm.model';
import { ICustomOfferingRestrictions } from '../custom-service-offering/custom-offering-restrictions';


@Component({
  selector: 'cs-service-offering-dialog',
  templateUrl: 'service-offering-dialog.component.html',
  styleUrls: ['service-offering-dialog.component.scss'],
})
export class ServiceOfferingDialogComponent implements OnInit {
  @Input() public serviceOfferings: Array<ServiceOffering>;
  @Input() public serviceOfferingId: string;
  @Input() public restrictions: ICustomOfferingRestrictions;
  @Input() public isVmRunning: boolean;
  @Input() public virtualMachine: VirtualMachine;
  @Input() public resourceUsage: ResourceStats;
  @Output() public onServiceOfferingChange = new EventEmitter<ServiceOffering>();
  public serviceOffering: ServiceOffering;
  public loading: boolean;

  public ngOnInit() {
    if (this.serviceOfferings.length) {
      this.serviceOffering = this.serviceOfferings.find(_ => _.id === this.serviceOfferingId);
    }
  }

  public updateOffering(offering: ServiceOffering): void {
    this.serviceOffering = offering;
  }

  public onChange(): void {
    this.onServiceOfferingChange.emit(this.serviceOffering);
  }
}
