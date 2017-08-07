import { BaseModel } from '../shared/models/base.model';
import { FieldMapper } from '../shared/decorators/field-mapper.decorator';
import { Taggable } from '../shared/interfaces/taggable.interface';
import { Tag } from '../shared/models/tag.model';


export type NetworkRuleType = 'Ingress' | 'Egress';

export const NetworkRuleTypes = {
  Ingress: 'Ingress' as NetworkRuleType,
  Egress: 'Egress' as NetworkRuleType
};

export type NetworkProtocol = 'tcp' | 'udp' | 'icmp';

export const NetworkProtocols = {
  TCP: 'tcp' as NetworkProtocol,
  UDP: 'udp' as NetworkProtocol,
  ICMP: 'icmp' as NetworkProtocol
};

@FieldMapper({
  ruleid: 'ruleId',
  cidr: 'CIDR',
  startport: 'startPort',
  endport: 'endPort',
  icmpcode: 'icmpCode',
  icmptype: 'icmpType',
})
export class NetworkRule extends BaseModel {
  public ruleId: string;
  public protocol: NetworkProtocol;
  public CIDR: string;
  public startPort?: number;
  public endPort?: number;
  public icmpCode?: number;
  public icmpType?: number;

  public isEqual(networkRule: NetworkRule): boolean {
    if (this.CIDR !== networkRule.CIDR || this.protocol !== networkRule.protocol) {
      return false;
    }

    if (this.protocol === NetworkProtocols.TCP || this.protocol === NetworkProtocols.UDP) {
      return this.startPort === networkRule.startPort && this.endPort === networkRule.endPort;
    }

    if (this.protocol === NetworkProtocols.ICMP) {
      return this.icmpCode === networkRule.icmpCode && this.icmpType === networkRule.icmpType;
    }
  }
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

  public get isPredefinedTemplate(): boolean {
    return this.id.startsWith('template');
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

    this.tags = this.tags.map(tag => new Tag(tag));
  }
}
