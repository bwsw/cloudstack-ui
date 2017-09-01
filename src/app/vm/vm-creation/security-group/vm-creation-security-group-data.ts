import { SecurityGroup } from '../../../security-group/sg.model';
import { VmCreationSecurityGroupMode } from './vm-creation-security-group-mode';
import { Rules } from '../../../shared/components/security-group-builder/rules';


export interface VmCreationSecurityGroupData {
  mode: VmCreationSecurityGroupMode,
  rules?: Rules,
  securityGroup: SecurityGroup
}
