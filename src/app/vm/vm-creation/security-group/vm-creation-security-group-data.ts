import { SecurityGroup } from '../../../security-group/sg.model';
import { VmCreationSecurityGroupMode } from './vm-creation-security-group-mode';
import { Rules } from '../../../shared/components/security-group-builder/rules';


export class VmCreationSecurityGroupData {
  public mode: VmCreationSecurityGroupMode;
  public rules: Rules;
  public securityGroups: Array<SecurityGroup>;

  public static fromMode(mode: VmCreationSecurityGroupMode): VmCreationSecurityGroupData {
    return new VmCreationSecurityGroupData(mode);
  }

  public static fromRules(rules: Rules): VmCreationSecurityGroupData {
    return new VmCreationSecurityGroupData(VmCreationSecurityGroupMode.Builder, rules);
  }

  public static fromSecurityGroup(securityGroups: Array<SecurityGroup>): VmCreationSecurityGroupData {
    return new VmCreationSecurityGroupData(
      VmCreationSecurityGroupMode.Selector, undefined, securityGroups);
  }

  private constructor(mode?: VmCreationSecurityGroupMode, rules?: Rules, securityGroups?: Array<SecurityGroup>) {
    this.mode = mode;
    this.rules = rules;
    this.securityGroups = securityGroups;
  }
}
