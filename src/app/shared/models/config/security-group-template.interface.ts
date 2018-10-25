import { NetworkRule } from '../../../security-group/network-rule.model';

export interface SecurityGroupTemplate {
  id: string;
  name: string;
  description: string;
  preselected?: boolean;
  egressrule: NetworkRule[];
  ingressrule: NetworkRule[];
}
