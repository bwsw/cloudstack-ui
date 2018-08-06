import { NetworkRule } from '../../../security-group/network-rule.model';
import { SecurityGroup } from '../../../security-group/sg.model';


export class Rules { // defines what should be passed to inputRules
  public static createWithAllRulesSelected(securityGroups: Array<SecurityGroup>): Rules {
    const ingress = securityGroups.reduce((acc, securityGroup) => acc.concat(securityGroup.ingressrule), []);
    const egress = securityGroups.reduce((acc, securityGroup) => acc.concat(securityGroup.egressrule), []);

    return new Rules(securityGroups, ingress, egress);
  }

  constructor(
    public templates?: Array<SecurityGroup>,
    public ingress?: Array<NetworkRule>,
    public egress?: Array<NetworkRule>
  ) {
    this.ingress = ingress || [];
    this.egress = egress || [];
    this.templates = templates || [];
  }
}

