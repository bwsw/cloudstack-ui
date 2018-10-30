import { getType, isSecurityGroupNative, SecurityGroup, SecurityGroupType } from '../sg.model';
import { Action } from '../../shared/models';

export enum SecurityGroupActionType {
  View = 'view',
  Delete = 'delete',
  Convert = 'convert',
}

const securityGroupConvertAction = {
  name: 'SECURITY_GROUP_PAGE.ACTION.CONVERT',
  command: SecurityGroupActionType.Convert,
  icon: 'mdi-transfer',
  canShow: (securityGroup: SecurityGroup) => getType(securityGroup) === SecurityGroupType.Private,
  canActivate: () => true,
};

const doesGroupHaveNoVirtualMachines = (securityGroup: SecurityGroup) =>
  isSecurityGroupNative(securityGroup) && securityGroup.virtualmachineids.length === 0;

const securityGroupDeleteAction = {
  name: 'COMMON.DELETE',
  command: SecurityGroupActionType.Delete,
  icon: 'mdi-delete',
  canShow: doesGroupHaveNoVirtualMachines,
  canActivate: doesGroupHaveNoVirtualMachines,
};

const securityGroupShowRulesAction = {
  name: 'SECURITY_GROUP_PAGE.ACTION.RULES',
  command: SecurityGroupActionType.View,
  icon: 'mdi-eye',
  canShow: () => true,
  canActivate: () => true,
};

export class SecurityGroupActionService {
  public actions: Action<SecurityGroup>[] = [
    securityGroupConvertAction,
    securityGroupShowRulesAction,
    securityGroupDeleteAction,
  ];
}
