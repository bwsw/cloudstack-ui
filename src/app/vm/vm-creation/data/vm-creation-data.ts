import { SecurityGroup } from '../../../security-group/sg.model';
import {
  ICustomOfferingRestrictions,
  ICustomOfferingRestrictionsByZone
} from '../../../service-offering/custom-service-offering/custom-offering-restrictions';
import { ICustomServiceOffering } from '../../../service-offering/custom-service-offering/custom-service-offering';
import { AffinityGroup, DiskOffering, InstanceGroup, ServiceOffering, SSHKeyPair, Zone } from '../../../shared/models';
import { ResourceStats } from '../../../shared/services/resource-usage.service';
import { BaseTemplateModel, Iso, Template } from '../../../template/shared';
import { VmCreationConfigurationData } from '../services/vm-creation.service';
import { VmCreationState } from './vm-creation-state';
import { Rules } from '../../../shared/components/security-group-builder/rules';


export class VmCreationData {
  constructor(
    public affinityGroupList: Array<AffinityGroup>,
    public configurationData: VmCreationConfigurationData,
    public customOfferingRestrictionsByZone: ICustomOfferingRestrictionsByZone,
    public availablePrimaryStorage: number,
    public defaultName: string,
    public diskOfferings: Array<DiskOffering>,
    public instanceGroups: Array<InstanceGroup>,
    public resourceUsage: ResourceStats,
    public rootDiskSizeLimit: number,
    public securityGroupTemplates: Array<SecurityGroup>,
    public serviceOfferings: Array<ServiceOffering>,
    public sshKeyPairs: Array<SSHKeyPair>,
    public templates: Array<Template>,
    public isos: Array<Iso>,
    public zones: Array<Zone>
  ) {}

  public getDefaultServiceOffering(zone: Zone): ServiceOffering {
    const config = this.configurationData.defaultServiceOfferingConfig;
    const defaultServiceOfferingId = config && config[zone.id] && config[zone.id].offering;
    const defaultServiceOffering = this.serviceOfferings.find(_ => _.id === defaultServiceOfferingId);

    return defaultServiceOffering || this.serviceOfferings[0];
  }

  public getCustomOfferingParams(zone: Zone): ICustomServiceOffering {
    const config = this.configurationData.defaultServiceOfferingConfig;

    return config && config[zone.id] && config[zone.id].customOfferingParams;
  }

  public getCustomOfferingRestrictions(zone: Zone): ICustomOfferingRestrictions {
    const restrictions = this.customOfferingRestrictionsByZone;
    return restrictions && restrictions[zone.id];
  }

  public get defaultTemplate(): BaseTemplateModel {
    const templates: Array<BaseTemplateModel> = this.templates.length ? this.templates : this.isos;
    const filteredTemplates =  templates.filter(template => {
      return template.isReady;
    });

    return filteredTemplates[0];
  }

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

  public get installationSources(): Array<BaseTemplateModel> {
    return [].concat(this.templates, this.isos);
  }

  public getInitialState(): VmCreationState {
    return new VmCreationState(this);
  }

  public getAffinityGroup(name: string): AffinityGroup {
    return this.affinityGroupList.find(group => group.name === name);
  }

  public getInstanceGroup(name: string): InstanceGroup {
    return this.instanceGroups.find(group => group.name === name);
  }
}

