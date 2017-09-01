import { Component, OnChanges } from '@angular/core';
import { ZoneService } from '../../../shared/services/zone.service';
import { VirtualMachine } from '../../shared/vm.model';
import { ActivatedRoute } from '@angular/router';
import { VmService } from '../../shared/vm.service';


@Component({
  selector: 'cs-network-detail',
  templateUrl: 'network-detail.component.html'
})
export class NetworkDetailComponent implements OnChanges {
  public vm: VirtualMachine;

  public disableSecurityGroup: boolean;

  constructor(
    private vmService: VmService,
    private zoneService: ZoneService,
    private activatedRoute: ActivatedRoute
  ) {
    const params = this.activatedRoute.snapshot.parent.params;

    this.vmService.getWithDetails(params.id).subscribe(
      vm => {
        this.vm = vm;
      });
  }

  public ngOnChanges(): void {
    this.checkSecurityGroupDisabled();
  }

  private checkSecurityGroupDisabled(): void {
    this.zoneService.get(this.vm.zoneId)
      .subscribe(zone => this.disableSecurityGroup = zone.networkTypeIsBasic);
  }
}
