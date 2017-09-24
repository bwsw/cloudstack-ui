import { SecurityGroup } from '../../../security-group/sg.model';
import { VmCreationSecurityGroupMode } from './vm-creation-security-group-mode';
import { Rules } from '../../../shared/components/security-group-builder/rules';


export class VmCreationSecurityGroupData {
  public mode: VmCreationSecurityGroupMode;
  public rules: Rules;
  public securityGroup: SecurityGroup;

  public static fromMode(mode: VmCreationSecurityGroupMode): VmCreationSecurityGroupData {
    return new VmCreationSecurityGroupData(mode);
  }

  public static fromRules(rules: Rules): VmCreationSecurityGroupData {
    return new VmCreationSecurityGroupData(VmCreationSecurityGroupMode.Builder, rules);
  }

  public static fromSecurityGroup(securityGroup: SecurityGroup): VmCreationSecurityGroupData {
    return new VmCreationSecurityGroupData(
      VmCreationSecurityGroupMode.Selector, undefined, securityGroup);
  }

  private constructor(mode?: VmCreationSecurityGroupMode, rules?: Rules, securityGroup?: SecurityGroup) {
    this.mode = mode;
    this.rules = rules;
    this.securityGroup = securityGroup;
  }
}
