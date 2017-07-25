import { Rules } from '../../../security-group/sg-creation/sg-creation.component';
import { NetworkRule } from '../../../security-group/sg.model';
import { AffinityGroup, DiskOffering, InstanceGroup, ServiceOffering, SSHKeyPair, Zone } from '../../../shared/models';
import { BaseTemplateModel } from '../../../template/shared';
import { KeyboardLayout, KeyboardLayouts } from '../keyboards/keyboards.component';
import { NotSelected } from '../vm-creation.service';
import { VmCreationData } from './vm-creation-data';


interface VmCreationParams {
  affinityGroupNames?: string;
  details?: Array<any>;
  diskofferingid?: string;
  doStartVm?: string;
  hypervisor?: string;
  ingress?: Array<NetworkRule>;
  egress?: Array<NetworkRule>;
  keyboard?: string;
  keyPair?: string;
  name?: string;
  serviceOfferingId?: string;
  rootDiskSize?: number;
  size?: number;
  templateId?: string;
  zoneId?: string;
}

export class VmCreationState {
  public affinityGroup: AffinityGroup;
  public diskOffering: DiskOffering;
  public displayName: string;
  public doStartVm: boolean;
  public instanceGroup: InstanceGroup;
  public keyboard: KeyboardLayout;
  public rootDiskSize: number;
  public securityRules: Rules;
  public serviceOffering: ServiceOffering;
  public sshKeyPair: SSHKeyPair | NotSelected;
  public template: BaseTemplateModel;
  public zone: Zone;

  private _rootDiskSizeMin: number;

  private affinityGroupNames: Array<string>; // we need to know whether the group already exists
  private defaultName: string;               // to get default name if the name is empty

  constructor(data: VmCreationData) {
    this.getStateFromData(data);
  }

  public get affinityGroupExists(): boolean {
    return this.affinityGroupNames.includes(this.affinityGroup.name);
  }

  public get rootDiskSizeMin(): number {
    return this._rootDiskSizeMin;
  }

  public set rootDiskSizeMin(value: number) {
    this._rootDiskSizeMin = value;
    if (this.rootDiskSize < this.rootDiskSizeMin) {
      this.rootDiskSize = this.rootDiskSizeMin;
    }
  }

  public get showRootDiskResize(): boolean {
    return this.diskOffering && this.diskOffering.isCustomized;
  }

  public get showSecurityGroups(): boolean {
    return !this.zone.networkTypeIsBasic;
  };

  public get diskOfferingsAreAllowed(): boolean {
    return !this.template.isTemplate;
  }

  public getStateFromData(data: VmCreationData): void {
    this.securityRules = data.preselectedRules;
    this.affinityGroup = new AffinityGroup({ name: '' });
    this.affinityGroupNames = data.affinityGroupNames;
    this.defaultName = data.defaultName;
    this.displayName = data.defaultName;
    this.doStartVm = true;
    this.instanceGroup = new InstanceGroup('');
    this.keyboard = KeyboardLayouts.us;

    if (data.defaultTemplate) { this.template = data.defaultTemplate; }
    if (data.diskOfferings.length) { this.diskOffering = data.diskOfferings[0]; }
    if (data.instanceGroups.length) { this.instanceGroup = data.instanceGroups[0]; }
    if (data.sshKeyPairs.length) { this.sshKeyPair = data.sshKeyPairs[0]; }

    if (data.zones.length) {
      this.zone = data.zones[0];
      if (data.serviceOfferings.length) {
        this.serviceOffering = data.getDefaultServiceOffering(this.zone);
      }
    }
  }

  public getVmCreationParams(): VmCreationParams {
    const params: VmCreationParams = {};

    params.affinityGroupNames = this.affinityGroup && this.affinityGroup.name;
    params.doStartVm = this.doStartVm ? undefined : 'false';
    params.keyboard = this.keyboard;
    params.name = this.displayName || this.defaultName;
    params.serviceOfferingId = this.serviceOffering.id;
    params.templateId = this.template.id;
    params.zoneId = this.zone.id;

    if (this.sshKeyPair && !(this.sshKeyPair as NotSelected).ignore) {
      params.keyPair = this.sshKeyPair.name;
    }

    if (this.diskOffering && !this.template.isTemplate) {
      params.diskofferingid = this.diskOffering.id;
      params.hypervisor = 'KVM';
    }

    if (this.serviceOffering.areCustomParamsSet) {
      params.details = [{
        cpuNumber: this.serviceOffering.cpuNumber,
        cpuSpeed: this.serviceOffering.cpuSpeed,
        memory: this.serviceOffering.memory
      }];
    }

    if (this.template.isTemplate || this.showRootDiskResize) {
      if (this.template.isTemplate) {
        params.rootDiskSize = this.rootDiskSize;
      } else {
        params.size = this.rootDiskSize;
      }
    }

    return params;
  }
}
