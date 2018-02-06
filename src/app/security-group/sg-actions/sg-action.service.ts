import { getType, SecurityGroup, SecurityGroupType } from '../sg.model';
import { Action } from '../../shared/models/action.model';

export enum SecurityGroupActionType {
  View = 'view',
  Delete = 'delete',
  Convert = 'convert'
}

// #821 task
// const SecurityGroupConvertAction = {
//   name: 'SECURITY_GROUP_PAGE.ACTION.CONVERT',
//   command: SecurityGroupActionType.Convert,
//   icon: 'transform',
//   canActivate: (securityGroup: SecurityGroup) => securityGroup.type === SecurityGroupType.Private
// };

const SecurityGroupDeleteAction = {
  name: 'COMMON.DELETE',
  command: SecurityGroupActionType.Delete,
  icon: 'delete',
  canActivate: (securityGroup: SecurityGroup) => getType(securityGroup) !== SecurityGroupType.PredefinedTemplate && securityGroup.virtualMachineIds.length === 0
};

const SecurityGroupShowRulesAction = {
  name: 'SECURITY_GROUP_PAGE.ACTION.RULES',
  command: SecurityGroupActionType.View,
  icon: 'visibility',
  canActivate: () => true
};

export class SecurityGroupActionService {
  public actions: Array<Action<SecurityGroup>> = [
    SecurityGroupShowRulesAction,
    SecurityGroupDeleteAction
  ];
}
