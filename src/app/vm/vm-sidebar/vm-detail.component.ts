import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  AffinityGroupSelectorComponent
} from 'app/vm/vm-sidebar/affinity-group-selector/affinity-group-selector.component';
import { Observable } from 'rxjs/Observable';
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
export class VmDetailComponent implements OnChanges, OnInit {
  @Input() public vm: VirtualMachine;
  public description: string;
  public expandServiceOffering: boolean;
  public affinityGroupLoading: boolean;
  public sskKeyLoading: boolean;


  constructor(
    private dialogService: DialogService,
    private serviceOfferingService: ServiceOfferingService,
    private vmService: VmService
  ) {
    this.expandServiceOffering = false;
  }

  public ngOnInit(): void {

  }

  public ngOnChanges(): void {
    this.update();
  }

  public changeServiceOffering(): void {
    this.dialogService.showCustomDialog({
      component: ServiceOfferingDialogComponent,
      classes: 'service-offering-dialog',
      providers: [{ provide: 'virtualMachine', useValue: this.vm }],
    }).switchMap(res => res.onHide())
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

  private setAffinityGroupLoading(value: boolean) {
    this.affinityGroupLoading = value;
  }

  private setSshKeyLoading(value: boolean) {
    this.sskKeyLoading = value;
  }

  public changeAffinityGroup(): void {
    this.askToStopVM(this.vm, 'STOP_MACHINE_FOR_AG', this.setAffinityGroupLoading.bind(this))
      .filter(stopped => !!stopped)
      .subscribe(() => this.showAffinityGroupDialog());
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
    this.askToStopVM(this.vm, 'STOP_MACHINE_FOR_SSH', this.setSshKeyLoading.bind(this))
      .filter(stopped => !!stopped)
      .subscribe(() => this.showSshKeypairResetDialog());
  }

  public updateStats(): void {
    this.vmService.getWithDetails(this.vm.id)
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

  private askToStopVM(currentVM: VirtualMachine, message: string, loadingFunction: Function = () => {
  }): Observable<any> {
    loadingFunction(true);
    return this.vmService.get(currentVM.id)
      .do(() => loadingFunction(false))
      .switchMap(vm => {
        if (vm.state === VmStates.Stopped) {
          return Observable.of(true);
        }

        return this.dialogService.customConfirm({
          message: message,
          confirmText: 'STOP',
          declineText: 'CANCEL',
          width: '350px',
          clickOutsideToClose: false
        })
          .onErrorResumeNext()
          .switchMap((result) => {
            if (result === null) {
              loadingFunction(true);
              return this.vmService.command({
                action: VirtualMachine.getAction(VmActions.STOP),
                vm: vm
              })
                .do(() => loadingFunction(false))
                .switchMap(() => Observable.of(true))
            } else {
              return Observable.of(false);
            }
          });
      });
  }

  private showAffinityGroupDialog(): void {
    this.dialogService.showCustomDialog({
      component: AffinityGroupSelectorComponent,
      styles: { width: '350px' },
      providers: [{ provide: 'virtualMachine', useValue: this.vm }],
      clickOutsideToClose: false
    }).switchMap(dialog => dialog.onHide())
      .subscribe((group?: Array<AffinityGroup>) => {
        if (group) {
          this.vm.affinityGroup = group;
        }
      });
  }

  private showSshKeypairResetDialog(): void {
    this.dialogService.showCustomDialog({
      component: SshKeypairResetComponent,
      styles: { width: '350px' },
      providers: [{ provide: 'virtualMachine', useValue: this.vm }],
      clickOutsideToClose: false
    }).switchMap(dialog => dialog.onHide())
      .subscribe((keyPairName: string) => {
        if (keyPairName) {
          this.vm.keyPair = keyPairName;
        }
      });
  }
}
