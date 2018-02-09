import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import {
  AffinityGroup,
  InstanceGroup,
  ServiceOffering,
  SSHKeyPair,
  Zone
} from '../../shared/models';
import { DiskOffering, Account } from '../../shared/models';
import { BaseTemplateModel } from '../../template/shared';
import { VirtualMachine } from '../shared/vm.model';
import { NotSelected, VmCreationState } from './data/vm-creation-state';
import { VmCreationSecurityGroupData } from './security-group/vm-creation-security-group-data';
import { VmCreationAgreementComponent } from './template/agreement/vm-creation-agreement.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
// tslint:disable-next-line
import { ICustomOfferingRestrictions } from '../../service-offering/custom-service-offering/custom-offering-restrictions';
// tslint:disable-next-line
import { ProgressLoggerMessage, } from '../../shared/components/progress-logger/progress-logger-message/progress-logger-message';
import { VmCreationContainerComponent } from './containers/vm-creation.container';
import { AuthService } from '../../shared/services/auth.service';

import * as clone from 'lodash/clone';

@Component({
  selector: 'cs-vm-create',
  templateUrl: 'vm-creation.component.html',
  styleUrls: ['vm-creation.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VmCreationAgreementComponent),
      multi: true
    }
  ]
})
export class VmCreationComponent {
  @Input() public account: Account;
  @Input() public vmCreationState: VmCreationState;
  @Input() public instanceGroupList: InstanceGroup[];
  @Input() public affinityGroupList: AffinityGroup[];
  @Input() public diskOfferings: DiskOffering[];
  @Input() public zones: Zone[];
  @Input() public sshKeyPairs: SSHKeyPair[];
  @Input() public serviceOfferings: ServiceOffering[];
  @Input() public customOfferingRestrictions: ICustomOfferingRestrictions;

  @Input() public fetching: boolean;
  @Input() public diskOfferingsAreLoading: boolean;
  @Input() public showOverlay: boolean;
  @Input() public deploymentInProgress: boolean;
  @Input() public loggerStageList: Array<ProgressLoggerMessage>;
  @Input() public deployedVm: VirtualMachine;
  @Input() public enoughResources: boolean;
  @Input() public insufficientResources: Array<string>;
  @Input() public diskOfferingParams: Array<string>;

  @Output() public displayNameChange = new EventEmitter<string>();
  @Output() public serviceOfferingChange = new EventEmitter<ServiceOffering>();
  @Output() public diskOfferingChange = new EventEmitter<DiskOffering>();
  @Output() public rootDiskSizeMinChange = new EventEmitter<number>();
  @Output() public rootDiskSizeChange = new EventEmitter<number>();
  @Output() public affinityGroupChange = new EventEmitter<AffinityGroup>();
  @Output() public instanceGroupChange = new EventEmitter<InstanceGroup>();
  @Output() public securityRulesChange = new EventEmitter<VmCreationSecurityGroupData>();
  @Output() public templateChange = new EventEmitter<BaseTemplateModel>();
  @Output() public onSshKeyPairChange = new EventEmitter<SSHKeyPair | NotSelected>();
  @Output() public doStartVmChange = new EventEmitter<boolean>();
  @Output() public zoneChange = new EventEmitter<Zone>();
  @Output() public agreementChange = new EventEmitter<boolean>();
  @Output() public onVmDeploymentFailed = new EventEmitter();
  @Output() public deploy = new EventEmitter<VmCreationState>();
  @Output() public cancel = new EventEmitter();
  @Output() public onError = new EventEmitter();


  public insufficientResourcesErrorMap = {
    instances: 'VM_PAGE.VM_CREATION.INSTANCES',
    ips: 'VM_PAGE.VM_CREATION.IPS',
    volumes: 'VM_PAGE.VM_CREATION.VOLUMES',
    cpus: 'VM_PAGE.VM_CREATION.CPUS',
    memory: 'VM_PAGE.VM_CREATION.MEMORY',
    primaryStorage: 'VM_PAGE.VM_CREATION.PRIMARY_STORAGE'
  };

  public takenName: string;
  public maxEntityNameLength = 63;

  public visibleAffinityGroups: Array<AffinityGroup>;
  public visibleInstanceGroups: Array<InstanceGroup>;

  public get nameIsTaken(): boolean {
    return !!this.vmCreationState && this.vmCreationState.displayName === this.takenName;
  }

  public get diskOfferingsAreAllowed(): boolean {
    return this.vmCreationState.template
      && !this.vmCreationState.template.isTemplate;
  }

  public get showResizeSlider(): boolean {
    return this.vmCreationState.template
      && !this.vmCreationState.template.isTemplate
      && this.showRootDiskResize
      && !!this.vmCreationState.rootDiskMinSize;
  }

  public get rootDiskSizeLimit(): number {
    return this.account && this.account.primarystorageavailable;
  }

  public get showRootDiskResize(): boolean {
    return this.vmCreationState.diskOffering
      && this.vmCreationState.diskOffering.iscustomized;
  }

  public get showSecurityGroups(): boolean {
    return this.vmCreationState.zone
      && this.vmCreationState.zone.securitygroupsenabled
      && this.auth.isSecurityGroupEnabled();
  }

  constructor(
    public dialogRef: MatDialogRef<VmCreationContainerComponent>,
    private auth: AuthService
  ) {
  }

  public changeTemplate(value: BaseTemplateModel) {
    this.agreementChange.emit(value.agreementAccepted);
    this.templateChange.emit(value);
  }

  public changeInstanceGroup(groupName: string): void {
    const val = groupName.toLowerCase();
    this.visibleInstanceGroups = this.instanceGroupList.filter(
      g => g.name.toLowerCase().indexOf(val) === 0
    );

    const existingGroup = this.getInstanceGroup(groupName);
    const instanceGroup = clone(existingGroup) || new InstanceGroup(groupName);
    this.instanceGroupChange.emit(instanceGroup);
  }

  public getInstanceGroup(name: string): InstanceGroup {
    return this.instanceGroupList.find(group => group.name === name);
  }

  public changeAffinityGroup(groupName: string): void {
    const val = groupName.toLowerCase();
    this.visibleAffinityGroups = this.affinityGroupList.filter(
      g => g.name.toLowerCase().indexOf(val) === 0
    );
    const existingGroup = this.affinityGroupList.find(group => group.name === groupName);

    this.affinityGroupChange.emit(clone(existingGroup) || { name: groupName });
  }

  public onVmCreationSubmit(e: any): void {
    e.preventDefault();
    this.deploy.emit(this.vmCreationState);
  }
}
