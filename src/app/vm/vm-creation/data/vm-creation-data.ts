import { Rules } from '../../../security-group/sg-creation/sg-creation.component';
import { SecurityGroup } from '../../../security-group/sg.model';
import {
  AffinityGroup,
  DiskOffering,
  InstanceGroup,
  ServiceOffering,
  SSHKeyPair,
  Zone
} from '../../../shared/models';
import { Template } from '../../../template/shared';
import { VmCreationState } from './vm-creation-state';
import { ResourceStats } from '../../../shared/services/resource-usage.service';
import { VmCreationConfigurationData } from '../vm-creation.service';


export class VmCreationData {
  constructor(
    public affinityGroupList: Array<AffinityGroup>,
    public configurationData: VmCreationConfigurationData,
    public availablePrimaryStorage: number,
    public defaultName: string,
    public defaultTemplate: Template,
    public diskOfferings: Array<DiskOffering>,
    public instanceGroups: Array<InstanceGroup>,
    public resourceUsage: ResourceStats,
    public rootDiskSizeLimit: number,
    public securityGroupTemplates: Array<SecurityGroup>,
    public serviceOfferings: Array<ServiceOffering>,
    public sshKeyPairs: Array<SSHKeyPair>,
    public zones: Array<Zone>
  ) {}

  public get affinityGroupNames(): Array<string> {
    return this.affinityGroupList.map(_ => _.name);
  }

  public get instanceGroupNames(): Array<string> {
    return this.instanceGroups.map(_ => _.name);
  }

  public get preselectedRules(): Rules {
    const preselectedSecurityGroups = this.securityGroupTemplates
      .filter(securityGroup => securityGroup.preselected);
    return Rules.createWithAllRulesSelected(preselectedSecurityGroups);
  }

  public getInitialState(): VmCreationState {
    return new VmCreationState(this);
  }
}

