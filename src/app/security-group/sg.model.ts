import { Taggable } from '../shared/interfaces/taggable.interface';
import { BaseModelInterface } from '../shared/models/base.model';
import { Tag } from '../shared/models/tag.model';
import { SecurityGroupTagKeys } from '../shared/services/tags/security-group-tag-keys';
import { NetworkRule } from './network-rule.model';


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

export const SecurityGroupResourceType = 'SecurityGroup';
export interface SecurityGroup extends BaseModelInterface, Taggable {
  id: string;
  name: string;
  description?: string;
  account: string;
  domain: string;
  ingressrule: Array<NetworkRule>;
  egressrule: Array<NetworkRule>;
  virtualmachineids: Array<string>;
  tags: Array<Tag>;
  preselected?: boolean;
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
