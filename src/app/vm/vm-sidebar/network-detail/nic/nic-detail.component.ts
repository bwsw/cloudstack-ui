import { Component, Input } from '@angular/core';
import { VirtualMachine } from '../../../shared/vm.model';
import { DialogService } from '../../../../dialog/dialog-service/dialog.service';
import { VmService } from '../../../shared/vm.service';


@Component({
  selector: 'cs-nic-detail',
  templateUrl: 'nic-detail.component.html',
  styleUrls: ['nic-detail.component.scss']
})
export class NicDetailComponent {
  @Input() public vm: VirtualMachine;

  public expandNIC = false;

  constructor(
    private dialogService: DialogService,
    private vmService: VmService
  ) {}

  public toggleNIC(): void {
    this.expandNIC = !this.expandNIC;
  }

  public confirmAddSecondaryIp(vm: VirtualMachine): void {
    this.dialogService.confirm({
      message: 'VM_PAGE.NETWORK_DETAILS.ARE_YOU_SURE_ADD_SECONDARY_IP'
    }).onErrorResumeNext()
      .subscribe((res) => { if (res) { this.addSecondaryIp(vm); } });
  }

  public confirmRemoveSecondaryIp(secondaryIpId: string, vm: VirtualMachine): void {
    this.dialogService.confirm({
      message: 'VM_PAGE.NETWORK_DETAILS.ARE_YOU_SURE_REMOVE_SECONDARY_IP'
    }).onErrorResumeNext()
      .subscribe((res) => { if (res) { this.removeSecondaryIp(secondaryIpId, vm); } });
  }

  private addSecondaryIp(vm: VirtualMachine): void {
    this.vmService.addIpToNic(vm.nic[0].id)
      .subscribe(
        res => {
          const ip = res.result.nicsecondaryip;
          vm.nic[0].secondaryIp.push(ip);
        },
        err => this.dialogService.alert({ message: err.errortext })
      );
  }

  private removeSecondaryIp(secondaryIpId: string, vm: VirtualMachine): void {
    this.vmService.removeIpFromNic(secondaryIpId)
      .subscribe(
        () => {
          vm.nic[0].secondaryIp = vm.nic[0].secondaryIp.filter(ip => ip.id !== secondaryIpId);
        },
        err => this.dialogService.alert({ message: err.errortext })
      );
  }
}
