import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IpAddress } from '../../../../../shared/models/ip-address.model';

@Component({
  selector: 'cs-secondary-ip',
  templateUrl: 'secondary-ip.component.html',
  styleUrls: ['../nics.scss', 'secondary-ip.component.scss'],
})
export class SecondaryIpComponent {
  @Input()
  public secondaryIp: IpAddress;
  @Output()
  public removed = new EventEmitter<IpAddress>();

  public remove(): void {
    this.removed.emit(this.secondaryIp);
  }
}
