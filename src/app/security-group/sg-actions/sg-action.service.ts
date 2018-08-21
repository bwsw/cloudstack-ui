import { getType, SecurityGroup, SecurityGroupType } from '../sg.model';
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

const SecurityGroupDeleteAction = {
  name: 'COMMON.DELETE',
  command: SecurityGroupActionType.Delete,
  icon: 'mdi-delete',
  canShow: () => true,
  canActivate: (securityGroup: SecurityGroup) =>
    getType(securityGroup) !== SecurityGroupType.PredefinedTemplate && securityGroup.virtualmachineids.length === 0
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
