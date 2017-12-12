import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ProgressLoggerController } from '../../shared/components/progress-logger/progress-logger.service';
import { AffinityGroup, InstanceGroup, ServiceOffering, SSHKeyPair, Zone } from '../../shared/models';
import { DiskOffering, Account } from '../../shared/models';
import { BaseTemplateModel } from '../../template/shared';
import { VirtualMachine } from '../shared/vm.model';
import { NotSelected } from './data/vm-creation-state';
import { VmCreationSecurityGroupData } from './security-group/vm-creation-security-group-data';
import { VmCreationAgreementComponent } from './template/agreement/vm-creation-agreement.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
// tslint:disable-next-line
import { ICustomOfferingRestrictions } from '../../service-offering/custom-service-offering/custom-offering-restrictions';
// tslint:disable-next-line
import { ProgressLoggerMessage, } from '../../shared/components/progress-logger/progress-logger-message/progress-logger-message';
import { VmCreationContainerComponent } from './containers/vm-creation.container';
import { FormState } from '../../reducers/vm/redux/vm.reducers';
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
  @Input() public vmCreationState: FormState;
  @Input() public instanceGroupList: InstanceGroup[];
  @Input() public affinityGroupList: AffinityGroup[];
  @Input() public zones: Zone[];
  @Input() public serviceOfferings: ServiceOffering[];
  @Input() public customOfferingRestrictions: ICustomOfferingRestrictions;
  @Input() public serviceOfferingsAreLoading: boolean;

  @Input() public fetching: boolean;
  @Input() public showOverlay: boolean;
  @Input() public deploymentStopped: boolean;
  @Input() public loggerStageList: Array<ProgressLoggerMessage>;
  @Input() public deployedVm: VirtualMachine;
  @Input() public enoughResources: boolean;
  @Input() public insufficientResources: Array<string>;

  @Output() public displayNameChange = new EventEmitter<string>();
  @Output() public serviceOfferingChange = new EventEmitter<ServiceOffering>();
  @Output() public diskOfferingChange = new EventEmitter<DiskOffering>();
  @Output() public rootDiskSizeMinChange = new EventEmitter<number>();
  @Output() public rootDiskSizeChange = new EventEmitter<number>();
  @Output() public affinityGroupChange = new EventEmitter<AffinityGroup>();
  @Output() public instanceGroupChange = new EventEmitter<InstanceGroup>();
  @Output() public securityRulesChange = new EventEmitter<VmCreationSecurityGroupData>();
  @Output() public keyboardChange = new EventEmitter<VmCreationSecurityGroupData>();
  @Output() public templateChange = new EventEmitter<BaseTemplateModel>();
  @Output() public sshKeyPairChange = new EventEmitter<SSHKeyPair | NotSelected>();
  @Output() public doStartVmChange = new EventEmitter<boolean>();
  @Output() public zoneChange = new EventEmitter<Zone>();
  @Output() public agreementChange = new EventEmitter<boolean>();
  @Output() public onVmDeploymentFinish = new EventEmitter<VirtualMachine>();
  @Output() public onVmDeploymentFailed = new EventEmitter();
  @Output() public deploy = new EventEmitter<FormState>();
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
  public progressLoggerController = new ProgressLoggerController();
  public maxEntityNameLength = 63;

  public visibleAffinityGroups: Array<AffinityGroup>;
  public visibleInstanceGroups: Array<InstanceGroup>;

  public get nameIsTaken(): boolean {
    return !!this.vmCreationState && this.vmCreationState.state.displayName === this.takenName;
  }

  public get diskOfferingsAreAllowed(): boolean {
    return this.vmCreationState.state.template
      && !this.vmCreationState.state.template.isTemplate;
  }

  public get rootDiskSizeLimit(): number {
    return this.account && this.account.primarystorageavailable;
  }

  public get showRootDiskResize(): boolean {
    return this.vmCreationState.state.diskOffering && this.vmCreationState.state.diskOffering.isCustomized;
  }

  public get showSecurityGroups(): boolean {
    return this.vmCreationState.state.zone
      && this.vmCreationState.state.zone.securitygroupsenabled
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

    this.affinityGroupChange.emit(clone(existingGroup) || new AffinityGroup({ name: groupName }));
  }

  public onVmCreationSubmit(e: any): void {
    e.preventDefault();
    this.deploy.emit(this.vmCreationState);
  }
}
