import { NetworkProtocol } from '../../network-rule.model';
import { NetworkRuleType } from '../../sg.model';

export interface FirewallRule {
  type: NetworkRuleType;
  protocol: NetworkProtocol;
  cidr: string;
  icmpType?: number;
  icmpCode?: number;
  startPort?: number;
  endPort?: number;
}
