import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material';
const clone = require('lodash/clone');

import {
  Account,
  AffinityGroup,
  DiskOffering,
  ServiceOffering,
  SSHKeyPair,
  Zone,
} from '../../shared/models';
import { BaseTemplateModel, isTemplate } from '../../template/shared';
import { isVMUserDataValid, VirtualMachine } from '../shared/vm.model';
import { NotSelected, VmCreationState } from './data/vm-creation-state';
import { VmCreationSecurityGroupData } from './security-group/vm-creation-security-group-data';
import { VmCreationContainerComponent } from './containers/vm-creation.container';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
// tslint:disable-next-line
import { ProgressLoggerMessage } from '../../shared/components/progress-logger/progress-logger-message/progress-logger-message';

@Component({
  selector: 'cs-vm-creation',
  templateUrl: 'vm-creation.component.html',
  styleUrls: ['vm-creation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VmCreationComponent {
  @Input()
  public account: Account;
  @Input()
  public vmCreationState: VmCreationState;
  @Input()
  public instanceGroupList: string[];
  @Input()
  public affinityGroupList: AffinityGroup[];
  @Input()
  public diskOfferings: DiskOffering[];
  @Input()
  public zones: Zone[];
  @Input()
  public sshKeyPairs: SSHKeyPair[];
  @Input()
  public serviceOfferings: ServiceOffering[];

  @Input()
  public fetching: boolean;
  @Input()
  public diskOfferingsAreLoading: boolean;
  @Input()
  public showOverlay: boolean;
  @Input()
  public deploymentInProgress: boolean;
  @Input()
  public loggerStageList: ProgressLoggerMessage[];
  @Input()
  public isError: boolean;
  @Input()
  public deployedVm: VirtualMachine;
  @Input()
  public enoughResources: boolean;
  @Input()
  public insufficientResources: string[];
  @Input()
  public virtualMachineList: VirtualMachine[];
  @Input()
  public minSize: number;
  @Input()
  public isDiskOfferingAvailableByResources: boolean;
  @Input()
  public maxRootSize: number;
  @Input()
  public isSecurityGroupEnabled: boolean;

  @Output()
  public displayNameChange = new EventEmitter<string>();
  @Output()
  public hostNameChange = new EventEmitter<string>();
  @Output()
  public serviceOfferingChange = new EventEmitter<ServiceOffering>();
  @Output()
  public diskOfferingChange = new EventEmitter<DiskOffering>();
  @Output()
  public rootDiskSizeMinChange = new EventEmitter<number>();
  @Output()
  public rootDiskSizeChange = new EventEmitter<number>();
  @Output()
  public affinityGroupChange = new EventEmitter<AffinityGroup>();
  @Output()
  public instanceGroupChange = new EventEmitter<string>();
  @Output()
  public securityRulesChange = new EventEmitter<VmCreationSecurityGroupData>();
  @Output()
  public templateChange = new EventEmitter<BaseTemplateModel>();
  @Output()
  public sshKeyPairChanged = new EventEmitter<SSHKeyPair | NotSelected>();
  @Output()
  public doStartVmChange = new EventEmitter<boolean>();
  @Output()
  public zoneChange = new EventEmitter<Zone>();
  @Output()
  public agreementChange = new EventEmitter<boolean>();
  @Output()
  public userDataChanged = new EventEmitter<string>();
  @Output()
  public vmDeploymentFailed = new EventEmitter();
  @Output()
  public deploy = new EventEmitter<VmCreationState>();
  @Output()
  public cancel = new EventEmitter();

  public insufficientResourcesErrorMap = {
    instances: 'VM_PAGE.VM_CREATION.INSTANCES',
    ips: 'VM_PAGE.VM_CREATION.IPS',
    volumes: 'VM_PAGE.VM_CREATION.VOLUMES',
    cpus: 'VM_PAGE.VM_CREATION.CPUS',
    memory: 'VM_PAGE.VM_CREATION.MEMORY',
    primaryStorage: 'VM_PAGE.VM_CREATION.PRIMARY_STORAGE',
  };

  public maxEntityNameLength = 63;
  public visibleInstanceGroups: string[];

  constructor(
    public dialogRef: MatDialogRef<VmCreationContainerComponent>,
    private dialogService: DialogService,
  ) {}

  public hostNameIsTaken(): boolean {
    if (!!this.vmCreationState) {
      return !!this.virtualMachineList.find(vm => vm.name === this.vmCreationState.name);
    }
    return false;
  }

  public diskOfferingsAreAllowed(): boolean {
    return this.vmCreationState.template && !isTemplate(this.vmCreationState.template);
  }

  public showResizeSlider(): boolean {
    const template = isTemplate(this.vmCreationState.template);
    return template || (!template && this.isCustomizedDiskOffering());
  }

  public rootDiskSizeLimit(): number {
    const primaryStorageAvailable = this.account && this.account.primarystorageavailable;
    const storageAvailable = Number(primaryStorageAvailable);
    if (primaryStorageAvailable === 'Unlimited' || isNaN(storageAvailable)) {
      return this.maxRootSize;
    }
    if (storageAvailable < this.maxRootSize) {
      return storageAvailable;
    }
    return this.maxRootSize;
  }

  public isCustomizedDiskOffering(): boolean {
    if (this.vmCreationState.diskOffering) {
      return this.vmCreationState.diskOffering.iscustomized;
    }
    return false;
  }

  public showSecurityGroups(): boolean {
    return (
      this.vmCreationState.zone &&
      this.vmCreationState.zone.securitygroupsenabled &&
      this.isSecurityGroupEnabled
    );
  }

  public changeTemplate(value: BaseTemplateModel) {
    this.agreementChange.emit(value.agreementAccepted);
    this.templateChange.emit(value);
  }

  public changeInstanceGroup(groupName: string): void {
    const val = groupName.toLowerCase();
    this.visibleInstanceGroups = this.instanceGroupList.filter(g => g.toLowerCase().includes(val));
    this.instanceGroupChange.emit(groupName);
  }

  public changeAffinityGroup(groupId: string): void {
    const affinityGroup = this.affinityGroupList.find(group => group.id === groupId);
    this.affinityGroupChange.emit(clone(affinityGroup));
  }

  public onVmCreationSubmit(e: any): void {
    e.preventDefault();
    if (!isVMUserDataValid(this.vmCreationState.userData)) {
      this.dialogService.alert({ message: 'ERRORS.VM.USER_DATA_TOO_BIG' });
    } else {
      this.deploy.emit(this.vmCreationState);
    }
  }

  public isSubmitButtonDisabled(isFormValid: boolean): boolean {
    return (
      !isFormValid ||
      this.hostNameIsTaken() ||
      !this.vmCreationState.template ||
      !this.vmCreationState.serviceOffering ||
      !this.vmCreationState.serviceOffering.isAvailableByResources ||
      !this.isDiskOfferingAvailableByResources
    );
  }
}
