import { Component, Input } from '@angular/core';
import { NIC } from '../../../../../../shared/models/nic.model';
import { transformSubnetMaskToCidrSuffix } from '../../../../../../shared/utils/subnet-mask-to-cidr-suffix';

@Component({
  selector: 'cs-nic-fields',
  templateUrl: 'nic-fields.component.html',
})
export class NicFieldsComponent {
  @Input()
  public nic: NIC;

  public get ipWithSuffix(): string {
    if (!this.nic.ipaddress) {
      return 'VM_PAGE.NETWORK_DETAILS.IP_NA';
    }

    return `${this.nic.ipaddress}${transformSubnetMaskToCidrSuffix(this.nic.netmask)}`;
  }
}
