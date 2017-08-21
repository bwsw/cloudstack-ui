import { BaseModel } from '../shared/models/base.model';
import { FieldMapper } from '../shared/decorators/field-mapper.decorator';


export enum NetworkRuleType {
  Ingress = 'Ingress',
  Egress = 'Egress'
}

export enum NetworkProtocol {
  TCP = 'tcp',
  UDP = 'udp',
  ICMP = 'icmp'
}

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

    if (this.protocol === NetworkProtocol.TCP || this.protocol === NetworkProtocol.UDP) {
      return this.startPort === networkRule.startPort && this.endPort === networkRule.endPort;
    }

    if (this.protocol === NetworkProtocol.ICMP) {
      return this.icmpCode === networkRule.icmpCode && this.icmpType === networkRule.icmpType;
    }
  }
}

interface ITag {
  key: string;
  value: string;
}

@FieldMapper({
  ingressrule: 'ingressRules',
  egressrule: 'egressRules',
  virtualmachineids: 'virtualMachineIds'
})
export class SecurityGroup extends BaseModel {
  public id: string;
  public name: string;
  public description: string;
  public account: string;
  public domain: string;
  public ingressRules: Array<NetworkRule>;
  public egressRules: Array<NetworkRule>;
  public virtualMachineIds: Array<string>;
  public tags: Array<ITag>;
  public preselected: boolean;

  constructor(params?: {}) {
    super(params);

    for (let i = 0; i < this.ingressRules.length; i++) {
      this.ingressRules[i] = new NetworkRule(this.ingressRules[i]);
    }

    for (let i = 0; i < this.egressRules.length; i++) {
      this.egressRules[i] = new NetworkRule(this.egressRules[i]);
    }
  }

  public get isPredefinedTemplate(): boolean {
    return this.id.startsWith('template');
  }
}
