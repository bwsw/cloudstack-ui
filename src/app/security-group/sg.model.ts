import { BaseModel } from '../shared/models/base.model';
import { FieldMapper } from '../shared/decorators/field-mapper.decorator';
import { Taggable } from '../shared/interfaces/taggable.interface';
import { Tag } from '../shared/models/tag.model';
import { NetworkRule } from './network-rule.model';
import { SecurityGroupTagKeys } from '../shared/services/tags/security-group-tag-keys';


export enum SecurityGroupType {
  PredefinedTemplate = 'predefined-template',
  CustomTemplate = 'custom-template',
  Private = 'private',
  Shared = 'shared'
}

export enum NetworkRuleType {
  Ingress = 'Ingress',
  Egress = 'Egress'
}

export enum IPVersion {
  ipv4 = 'ipv4',
  ipv6 = 'ipv6'
}

@FieldMapper({
  ingressrule: 'ingressRules',
  egressrule: 'egressRules',
  virtualmachineids: 'virtualMachineIds'
})
export class SecurityGroup extends BaseModel implements Taggable {
  public resourceType = 'SecurityGroup';

  public id: string;
  public name: string;
  public description: string;
  public account: string;
  public domain: string;
  public ingressRules: Array<NetworkRule>;
  public egressRules: Array<NetworkRule>;
  public virtualMachineIds: Array<string>;
  public tags: Array<Tag>;
  public preselected: boolean;

  constructor(params?: {}) {
    super(params);

    this.initializeIngressRules();
    this.initializeEgressRules();
    this.initializeTags();
  }

  private initializeIngressRules(): void {
    if (!this.ingressRules) {
      this.ingressRules = [];
    }

    this.ingressRules = this.ingressRules.map(rule => {
      return new NetworkRule(rule);
    });
  }

  private initializeEgressRules(): void {
    if (!this.egressRules) {
      this.egressRules = [];
    }

    this.egressRules = this.egressRules.map(rule => {
      return new NetworkRule(rule);
    });
  }

  private initializeTags(): void {
    if (!this.tags) {
      this.tags = [];
    }
  }
}

export const getType = (securityGroup: SecurityGroup): SecurityGroupType => {
  if (securityGroup.id.startsWith('template')) {
    return SecurityGroupType.PredefinedTemplate;
  }

  if (isCustomTemplate(securityGroup)) {
    return SecurityGroupType.CustomTemplate;
  }

  if (isPrivate(securityGroup)) {
    return SecurityGroupType.Private;
  }

  return SecurityGroupType.Shared;
};

export const isCustomTemplate = (securityGroup: SecurityGroup) => {
  const typeTag = securityGroup.tags.find(tag => tag.key === SecurityGroupTagKeys.type);

  return typeTag && typeTag.value === SecurityGroupType.CustomTemplate;
};

export const isPrivate = (securityGroup: SecurityGroup) => {
  const typeTag = securityGroup.tags.find(tag => tag.key === SecurityGroupTagKeys.type);

  return typeTag && typeTag.value === SecurityGroupType.Private;
};
