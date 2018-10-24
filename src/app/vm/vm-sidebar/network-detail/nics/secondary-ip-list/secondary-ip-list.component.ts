import { Component, EventEmitter, Input, Output } from '@angular/core';
import { onErrorResumeNext } from 'rxjs/operators';

import { DialogService } from '../../../../../dialog/dialog-service/dialog.service';
import { NIC } from '../../../../../shared/models/nic.model';
import { IpAddress } from '../../../../../shared/models/ip-address.model';

@Component({
  selector: 'cs-secondary-ip-list',
  templateUrl: 'secondary-ip-list.component.html',
  styleUrls: ['secondary-ip-list.component.scss', '../nics.scss'],
})
export class SecondaryIpListComponent {
  @Input()
  public nic: NIC;
  @Output()
  public secondaryIpAdded = new EventEmitter<string>();
  @Output()
  public secondaryIpRemoved = new EventEmitter<IpAddress>();

  constructor(private dialogService: DialogService) {}

  public confirmAddSecondaryIp(): void {
    this.dialogService
      .confirm({
        message: 'VM_PAGE.NETWORK_DETAILS.ARE_YOU_SURE_ADD_SECONDARY_IP',
      })
      .pipe(onErrorResumeNext())
      .subscribe(res => {
        if (res) {
          this.addSecondaryIp();
        }
      });
  }

  public confirmRemoveSecondaryIp(secondaryIp: IpAddress): void {
    this.dialogService
      .confirm({
        message: 'VM_PAGE.NETWORK_DETAILS.ARE_YOU_SURE_REMOVE_SECONDARY_IP',
      })
      .pipe(onErrorResumeNext())
      .subscribe(res => {
        if (res) {
          this.removeSecondaryIp(secondaryIp);
        }
      });
  }

  private addSecondaryIp(): void {
    this.secondaryIpAdded.emit(this.nic.id);
  }

  private removeSecondaryIp(secondaryIp: IpAddress): void {
    this.secondaryIpRemoved.emit(secondaryIp);
  }
}
