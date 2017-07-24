import { Component, Input, OnChanges } from '@angular/core';
import { MdDialog } from '@angular/material';
import {
  AffinityGroupSelectorComponent
} from 'app/vm/vm-sidebar/affinity-group-selector/affinity-group-selector.component';
import { DialogService } from '../../dialog/dialog-module/dialog.service';
import {
  ServiceOfferingDialogComponent
} from '../../service-offering/service-offering-dialog/service-offering-dialog.component';
import { ServiceOffering, ServiceOfferingFields } from '../../shared/models';
import { AffinityGroup } from '../../shared/models/affinity-group.model';
import { ServiceOfferingService } from '../../shared/services/service-offering.service';
import { VirtualMachine, VmActions, VmStates } from '../shared/vm.model';
import { VmService } from '../shared/vm.service';
import { SshKeypairResetComponent } from './ssh/ssh-keypair-reset.component';


@Component({
  selector: 'cs-vm-detail',
  templateUrl: 'vm-detail.component.html',
  styleUrls: ['vm-detail.component.scss']
})
export class VmDetailComponent implements OnChanges {
  @Input() public vm: VirtualMachine;
  public description: string;
  public expandServiceOffering: boolean;


  constructor(
    private dialog: MdDialog,
    private dialogService: DialogService,
    private serviceOfferingService: ServiceOfferingService,
    private vmService: VmService
  ) {
    this.expandServiceOffering = false;
  }

  public ngOnChanges(): void {
    this.update();
  }

  public changeServiceOffering(): void {
    this.dialog.open(ServiceOfferingDialogComponent, {
      panelClass: 'service-offering-dialog',
      data: this.vm,
    }).afterClosed()
      .subscribe((newOffering: ServiceOffering) => {
        if (newOffering) {
          this.serviceOfferingService.get(newOffering.id).subscribe(offering => {
            this.vm.serviceOffering = offering;
          });
        }
      });
  }

  public changeDescription(newDescription: string): void {
    this.vmService
      .updateDescription(this.vm, newDescription)
      .onErrorResumeNext()
      .subscribe();
  }

  public changeAffinityGroup(): void {
    this.askToStopVM(
      'STOP_MACHINE_FOR_AG',
      () => this.showAffinityGroupDialog()
    );
  }

  public isNotFormattedField(key: string): boolean {
    return [
      ServiceOfferingFields.id,
      ServiceOfferingFields.created,
      ServiceOfferingFields.diskBytesReadRate,
      ServiceOfferingFields.diskBytesWriteRate,
      ServiceOfferingFields.storageType,
      ServiceOfferingFields.provisioningType
    ].indexOf(key) === -1;
  }

  public isTranslatedField(key: string): boolean {
    return [
      ServiceOfferingFields.storageType,
      ServiceOfferingFields.provisioningType
    ].indexOf(key) > -1;
  }

  public isDateField(key: string): boolean {
    return key === ServiceOfferingFields.created;
  }

  public isDiskStatsField(key: string): boolean {
    return [
      ServiceOfferingFields.diskBytesReadRate,
      ServiceOfferingFields.diskBytesWriteRate
    ].indexOf(key) > -1;
  }

  public toggleServiceOffering(): void {
    this.expandServiceOffering = !this.expandServiceOffering;
  }

  public resetSshKey(): void {
    this.askToStopVM(
      'STOP_MACHINE_FOR_SSH',
      () => this.showSshKeypairResetDialog()
    );
  }

  public updateStats(): void {
    this.vmService.get(this.vm.id)
      .subscribe(vm => {
        this.vm.cpuUsed = vm.cpuUsed;
        this.vm.networkKbsRead = vm.networkKbsRead;
        this.vm.networkKbsWrite = vm.networkKbsWrite;
        this.vm.diskKbsRead = vm.diskKbsRead;
        this.vm.diskKbsWrite = vm.diskKbsWrite;
        this.vm.diskIoRead = vm.diskIoRead;
        this.vm.diskIoWrite = vm.diskIoWrite;
      });
  }

  private update(): void {
    this.updateDescription();
  }

  private updateDescription(): void {
    this.vmService.getDescription(this.vm)
      .subscribe(description => {
        this.description = description;
      });
  }

  private askToStopVM(message: string, onStopped): void {
    if (this.vm.state === VmStates.Stopped) {
      onStopped();
      return;
    }

    this.dialogService.customConfirm({
      message: message,
      confirmText: 'STOP',
      declineText: 'CANCEL',
      width: '350px',
      clickOutsideToClose: false
    })
      .onErrorResumeNext()
      .subscribe((result) => {
        if (result === null) {
          this.vmService.command({
            action: VirtualMachine.getAction(VmActions.STOP),
            vm: this.vm
          })
            .subscribe(onStopped);
        }
      });
  }

  private showAffinityGroupDialog(): void {
    this.dialog.open(AffinityGroupSelectorComponent, {
      width: '350px',
      data: this.vm,
      disableClose: true
    }).afterClosed()
      .subscribe((group?: Array<AffinityGroup>) => {
        if (group) {
          this.vm.affinityGroup = group;
        }
      });
  }

  private showSshKeypairResetDialog(): void {
    this.dialog.open(SshKeypairResetComponent, {
      width: '350px',
      data: this.vm,
      disableClose: true
    }).afterClosed()
      .subscribe((keyPairName: string) => {
        if (keyPairName) {
          this.vm.keyPair = keyPairName;
        }
      });
  }
}
