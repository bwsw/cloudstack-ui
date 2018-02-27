import { BaseModelInterface } from '../shared/models/base.model';


export enum NetworkProtocol {
  TCP = 'tcp',
  UDP = 'udp',
  ICMP = 'icmp'
}

export const compareRules = (rule1: NetworkRule, rule2: NetworkRule): boolean => {
  if (rule1.cidr !== rule2.cidr || rule1.protocol !== rule2.protocol) {
    return false;
  }

  if (rule1.protocol === NetworkProtocol.TCP || rule1.protocol === NetworkProtocol.UDP) {
    return rule1.startport === rule2.startport && rule1.endport === rule2.endport;
  }

  if (rule1.protocol === NetworkProtocol.ICMP) {
    return rule1.icmpcode === rule2.icmpcode && rule1.icmptype === rule2.icmptype;
  }
}

export interface NetworkRule extends BaseModelInterface {
  type?: string;
  ruleid: string;
  protocol: NetworkProtocol;
  cidr: string;
  startport?: number;
  endport?: number;
  icmpcode?: number;
  icmptype?: number;
}
