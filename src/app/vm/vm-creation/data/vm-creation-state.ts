import { Rules } from '../../../security-group/sg-creation/sg-creation.component';
import {
  AffinityGroup,
  AffinityGroupType,
  DiskOffering,
  InstanceGroup,
  ServiceOffering,
  SSHKeyPair,
  Zone
} from '../../../shared/models';
import { AuthService } from '../../../shared/services';
import { ServiceLocator } from '../../../shared/services/service-locator';
import { UtilsService } from '../../../shared/services/utils.service';
import { BaseTemplateModel } from '../../../template/shared';
import { VmService } from '../../shared/vm.service';
import { KeyboardLayouts } from '../keyboards/keyboards.component';
import { VmCreationData } from './vm-creation-data';
import { NetworkRule } from '../../../security-group/sg.model';


interface VmCreationParams {
  affinityGroupNames?: string;
  details?: Array<any>;
  diskofferingid?: string; // todo: check
  doStartVm?: string;
  hypervisor?: string;
  ingress?: Array<NetworkRule>;
  egress?: Array<NetworkRule>;
  keyboard?: string;
  keyPair?: string;
  name?: string;
  serviceOfferingIds?: string;
  response?: 'json';
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
  public keyboard: string;
  public keyPair: SSHKeyPair;
  public rootDiskSize: number;
  public rootDiskSizeMin: number;
  public securityRules: Rules;
  public serviceOffering: ServiceOffering;
  public zone: Zone;

  private _template: BaseTemplateModel;

  private auth: AuthService;
  private utils: UtilsService;
  private vmService: VmService;

  constructor(private data: VmCreationData) {
    this.auth = ServiceLocator.injector.get(AuthService);
    this.utils = ServiceLocator.injector.get(UtilsService);
    this.vmService = ServiceLocator.injector.get(VmService);

    this.reset(data);
  }

  public get affinityGroupExists(): boolean {
    return this.data.affinityGroupNames.includes(this.affinityGroup.name);
  }

  public get affinityGroupType(): AffinityGroupType {
    return this.data.affinityGroupTypes[0];
  }

  public get showRootDiskResize(): boolean {
    return this.diskOffering && this.diskOffering.isCustomized;
  }

  public get showSecurityGroups(): boolean {
    return !this.zone.networkTypeIsBasic;
  };

  public get template(): BaseTemplateModel {
    return this._template;
  }

  public set template(t: BaseTemplateModel) {
    if (t && this.utils.convertToGB(t.size || 0) < this.data.rootDiskSizeLimit) {
      this._template = t;
      this.setMinDiskSize();
    } else {
      // this.enoughResources = false;
    }
  }

  public reset(data?: VmCreationData): void {
    if (!data) { data = this.data; }

    const preselectedSecurityGroups = data.securityGroupTemplates.filter(securityGroup => securityGroup.preselected);
    this.securityRules = Rules.createWithAllRulesSelected(preselectedSecurityGroups);

    this.displayName = data.defaultName;
    this.doStartVm = true;
    this.keyboard = KeyboardLayouts.us;

    if (data.affinityGroupList.length) { this.affinityGroup = data.affinityGroupList[0]; }
    if (data.defaultTemplate) { this.template = data.defaultTemplate; }
    if (data.diskOfferings.length) { this.diskOffering = data.diskOfferings[0]; }
    if (data.instanceGroups.length) { this.instanceGroup = data.instanceGroups[0]; }
    if (data.serviceOfferings.length) { this.serviceOffering = data.serviceOfferings[0]; }
    if (data.sshKeyPairs.length) { this.keyPair = data.sshKeyPairs[0]; }
    if (data.serviceOfferings.length) { this.serviceOffering = data.serviceOfferings[0]; }
    if (data.zones.length) { this.zone = data.zones[0]; }
  }

  public getVmCreationParams(): VmCreationParams {
    let params: VmCreationParams = {};

    params.affinityGroupNames = this.affinityGroup && this.affinityGroup.name;
    params.doStartVm = this.doStartVm ? undefined : 'false';
    params.keyboard = this.keyboard;
    params.keyPair = this.keyPair.name; // todo: check
    params.name = this.displayName || this.data.defaultName;
    params.serviceOfferingIds = this.serviceOffering && this.serviceOffering.id;
    params.templateId = this.template && this.template.id;
    params.zoneId = this.zone && this.zone.id;
    params.response = 'json';

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

    if (this.securityRules && this.securityRules.ingress) {
      params.ingress = this.securityRules.ingress;
    }

    if (this.securityRules && this.securityRules.egress) {
      params.egress = this.securityRules.egress;
    }

    return params;
  }

  private setMinDiskSize(): void {
    const t = this.template;
    if (!t) {
      throw new Error('Template was not passed to set disk size');
    }

    if (t.size != null) {
      const newSize = t.size / Math.pow(2, 30);
      this.rootDiskSize = newSize;
      this.rootDiskSizeMin = newSize;
    } else {
      this.rootDiskSize = 1;
      this.rootDiskSizeMin = 1;
    }
  }
}
