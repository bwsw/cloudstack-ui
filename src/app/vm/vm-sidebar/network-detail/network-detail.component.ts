import { Component, Input, OnChanges } from '@angular/core';
import { ZoneService } from '../../../shared/services';
import { VirtualMachine } from '../../shared/vm.model';


@Component({
  selector: 'cs-network-detail',
  templateUrl: 'network-detail.component.html'
})
export class NetworkDetailComponent implements OnChanges {
  @Input() public vm: VirtualMachine;

  public disableSecurityGroup: boolean;

  constructor(private zoneService: ZoneService) {}

  public ngOnChanges(): void {
    this.checkSecurityGroupDisabled();
  }

  private checkSecurityGroupDisabled(): void {
    this.zoneService.get(this.vm.zoneId)
      .subscribe(zone => this.disableSecurityGroup = zone.networkTypeIsBasic);
  }
}
