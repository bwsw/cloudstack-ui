import { getType, isSecurityGroupNative, SecurityGroup, SecurityGroupType } from '../sg.model';
import { Action } from '../../shared/models';

export enum SecurityGroupActionType {
  View = 'view',
  Delete = 'delete',
  Convert = 'convert'
}

const SecurityGroupConvertAction = {
  name: 'SECURITY_GROUP_PAGE.ACTION.CONVERT',
  command: SecurityGroupActionType.Convert,
  icon: 'mdi-transfer',
  canShow: (securityGroup: SecurityGroup) => getType(securityGroup) === SecurityGroupType.Private,
  canActivate: () => true
};

const doesGroupHaveNoVirtualMachines = (securityGroup: SecurityGroup) => (
  // todo: these are probably the same thing, if so, we can simplify the condition
  isSecurityGroupNative(securityGroup) &&
  getType(securityGroup) !== SecurityGroupType.PredefinedTemplate &&
  securityGroup.virtualmachineids.length === 0
);

const SecurityGroupDeleteAction = {
  name: 'COMMON.DELETE',
  command: SecurityGroupActionType.Delete,
  icon: 'mdi-delete',
  canShow: doesGroupHaveNoVirtualMachines,
  canActivate: doesGroupHaveNoVirtualMachines
};

const SecurityGroupShowRulesAction = {
  name: 'SECURITY_GROUP_PAGE.ACTION.RULES',
  command: SecurityGroupActionType.View,
  icon: 'mdi-eye',
  canShow: () => true,
  canActivate: () => true
};

export class SecurityGroupActionService {
  public actions: Array<Action<SecurityGroup>> = [
    SecurityGroupConvertAction,
    SecurityGroupShowRulesAction,
    SecurityGroupDeleteAction,
  ];
}
