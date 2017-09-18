import { FieldMapper } from '../shared/decorators/field-mapper.decorator';
import { BaseModel } from '../shared/models/base.model';


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
