import { NetworkRule } from './network-rule.model';
import { SecurityGroupTagKeys } from '../shared/services/tags/security-group-tag-keys';
import { Tag } from '../shared/models';


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

export interface SecurityGroup {
  id: string;
  account: string;
  description: string;
  domain: string;
  domainid: string;
  name: string;
  virtualmachinecount: number;
  virtualmachineids: string[];
  egressrule: NetworkRule[];
  ingressrule: NetworkRule[]
  tags: Tag[];
  preselected?: boolean; // used by custom templates, described in config
}

export const isCustomTemplate = (securityGroup: SecurityGroup) => {
  const typeTag = securityGroup.tags.find(tag => tag.key === SecurityGroupTagKeys.type);

  return typeTag && typeTag.value === SecurityGroupType.CustomTemplate;
};

export const isPrivate = (securityGroup: SecurityGroup) => {
  const typeTag = securityGroup.tags.find(tag => tag.key === SecurityGroupTagKeys.type);

  return typeTag && typeTag.value === SecurityGroupType.Private;
};

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
