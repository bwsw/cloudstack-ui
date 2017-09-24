import { Component, Input } from '@angular/core';
import { DialogService } from '../../../../../dialog/dialog-service/dialog.service';
import { NIC } from '../../../../../shared/models/nic.model';
import { VmService } from '../../../../shared/vm.service';
import { IpAddress } from '../../../../../shared/models/ip-address.model';


@Component({
  selector: 'cs-secondary-ip-list',
  templateUrl: 'secondary-ip-list.component.html',
  styleUrls: ['secondary-ip-list.component.scss', '../nics.scss']
})
export class SecondaryIpListComponent {
  @Input() public nic: NIC;

  constructor(
    private dialogService: DialogService,
    private vmService: VmService
  ) {}

  public confirmAddSecondaryIp(): void {
    this.dialogService.confirm({
      message: 'VM_PAGE.NETWORK_DETAILS.ARE_YOU_SURE_ADD_SECONDARY_IP'
    })
      .onErrorResumeNext()
      .subscribe(res => {
        if (res) {
          this.addSecondaryIp();
        }
      });
  }

  public confirmRemoveSecondaryIp(secondaryIp: IpAddress): void {
    this.dialogService.confirm({
      message: 'VM_PAGE.NETWORK_DETAILS.ARE_YOU_SURE_REMOVE_SECONDARY_IP'
    })
      .onErrorResumeNext()
      .subscribe(res => {
        if (res) {
          this.removeSecondaryIp(secondaryIp);
        }
      });
  }

  private addSecondaryIp(): void {
    this.vmService.addIpToNic(this.nic.id)
      .subscribe(
        result => this.onAdded(result),
        error => this.onError(error)
      );
  }

  private onAdded(result: any): void {
    const ip = result.result.nicsecondaryip;
    this.nic.secondaryIp.push(ip);
  }

  private removeSecondaryIp(secondaryIp: IpAddress): void {
    this.vmService.removeIpFromNic(secondaryIp.id)
      .subscribe(
        () => this.onRemoved(secondaryIp.id),
        error => this.onError(error)
      );
  }

  private onRemoved(secondaryIpId: string): void {
    this.nic.secondaryIp = this.nic.secondaryIp.filter(ip => {
      return ip.id !== secondaryIpId;
    });
  }

  private onError(error: any): void {
    this.dialogService.alert({
      message: error.errortext
    });
  }
}
