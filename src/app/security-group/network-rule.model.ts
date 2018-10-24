export enum NetworkProtocol {
  TCP = 'tcp',
  UDP = 'udp',
  ICMP = 'icmp',
}

interface NetworkRuleBase {
  type?: string;
  cidr: string;
  protocol: NetworkProtocol;
  ruleid: string;
}

export interface IcmpNetworkRule extends NetworkRuleBase {
  icmpcode: number;
  icmptype: number;
}

export interface PortNetworkRule extends NetworkRuleBase {
  endport: number;
  startport: number;
}

export type NetworkRule = IcmpNetworkRule | PortNetworkRule;
