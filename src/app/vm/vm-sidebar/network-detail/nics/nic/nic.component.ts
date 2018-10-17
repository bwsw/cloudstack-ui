import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NIC } from '../../../../../shared/models/nic.model';
import { IpAddress } from '../../../../../shared/models/ip-address.model';

@Component({
  selector: 'cs-nic',
  templateUrl: 'nic.component.html',
  styleUrls: ['../nics.scss'],
})
export class NicComponent {
  @Input()
  public name: string;
  @Input()
  public nic: NIC;
  @Output()
  public secondaryIpAdded = new EventEmitter<string>();
  @Output()
  public secondaryIpRemoved = new EventEmitter<IpAddress>();
}
