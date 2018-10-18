import { SecurityGroup } from '../../../security-group/sg.model';
import { VmCreationSecurityGroupMode } from './vm-creation-security-group-mode';
import { Rules } from '../../../shared/components/security-group-builder/rules';

export class VmCreationSecurityGroupData {
  public mode: VmCreationSecurityGroupMode;
  public rules: Rules;
  public securityGroups: SecurityGroup[];

  private constructor(
    mode?: VmCreationSecurityGroupMode,
    rules?: Rules,
    securityGroups?: SecurityGroup[],
  ) {
    this.mode = mode;
    this.rules = rules;
    this.securityGroups = securityGroups;
  }

  public static fromRules(rules: Rules): VmCreationSecurityGroupData {
    return new VmCreationSecurityGroupData(VmCreationSecurityGroupMode.Builder, rules);
  }

  public static fromSecurityGroup(securityGroups: SecurityGroup[]): VmCreationSecurityGroupData {
    return new VmCreationSecurityGroupData(
      VmCreationSecurityGroupMode.Selector,
      undefined,
      securityGroups,
    );
  }
}
