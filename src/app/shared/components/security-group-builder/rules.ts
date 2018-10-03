import { NetworkRule } from '../../../security-group/network-rule.model';
import { SecurityGroupTemplate } from '../../models/config/security-group-template.interface';


export class Rules { // defines what should be passed to inputRules
  public static createWithAllRulesSelected(securityGroups: Array<SecurityGroupTemplate>): Rules {
    const ingress = securityGroups.reduce((acc, securityGroup) => acc.concat(securityGroup.ingressrule), []);
    const egress = securityGroups.reduce((acc, securityGroup) => acc.concat(securityGroup.egressrule), []);

    return new Rules(securityGroups, ingress, egress);
  }

  constructor(
    public templates?: Array<SecurityGroupTemplate>,
    public ingress?: Array<NetworkRule>,
    public egress?: Array<NetworkRule>
  ) {
    this.ingress = ingress || [];
    this.egress = egress || [];
    this.templates = templates || [];
  }
}

