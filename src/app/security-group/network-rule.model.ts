import { BaseModelInterface } from '../shared/models';


export enum NetworkProtocol {
  TCP = 'tcp',
  UDP = 'udp',
  ICMP = 'icmp'
}

export interface NetworkRule extends BaseModelInterface {
  type?: string;
  cidr: string;
  icmpcode?: number;
  icmptype?: number;
  protocol: NetworkProtocol;
  endport?: number;
  startport?: number;
  ruleid: string;
}
