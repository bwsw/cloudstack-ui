import { NetworkRule } from '../../../security-group/network-rule.model';
import { SecurityGroup } from '../../../security-group/sg.model';

export class Rules {
  // defines what should be passed to inputRules

  constructor(
    public templates?: SecurityGroup[],
    public ingress?: NetworkRule[],
    public egress?: NetworkRule[],
  ) {
    this.ingress = ingress || [];
    this.egress = egress || [];
    this.templates = templates || [];
  }

  public static createWithAllRulesSelected(securityGroups: SecurityGroup[]): Rules {
    const ingress = securityGroups.reduce(
      (acc, securityGroup) => acc.concat(securityGroup.ingressrule),
      [],
    );
    const egress = securityGroups.reduce(
      (acc, securityGroup) => acc.concat(securityGroup.egressrule),
      [],
    );

    return new Rules(securityGroups, ingress, egress);
  }
}
