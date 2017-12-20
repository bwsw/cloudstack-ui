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

  public get type(): SecurityGroupType {
    if (this.id.startsWith('template')) {
      return SecurityGroupType.PredefinedTemplate;
    }

    if (this.isCustomTemplate) {
      return SecurityGroupType.CustomTemplate;
    }

    if (this.isPrivate) {
      return SecurityGroupType.Private;
    }

    return SecurityGroupType.Shared;
  }

  private get isCustomTemplate(): boolean {
    const typeTag = this.tags.find(tag => tag.key === SecurityGroupTagKeys.type);

    return typeTag && typeTag.value === SecurityGroupType.CustomTemplate;
  }

  private get isPrivate(): boolean {
    const typeTag = this.tags.find(tag => tag.key === SecurityGroupTagKeys.type);

    return typeTag && typeTag.value === SecurityGroupType.Private
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

    this.tags = this.tags;
  }
}
