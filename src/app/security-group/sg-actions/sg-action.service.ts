import { SecurityGroup } from '../sg.model';
import { Action } from '../../shared/models/action.model';

export enum SecurityGroupActionType {
  View = 'view',
  Delete = 'delete',
}

const SecurityGroupDeleteAction = {
  name: 'COMMON.DELETE',
  command: SecurityGroupActionType.Delete,
  icon: 'delete',
  canActivate: (securityGroup: SecurityGroup) => true
};

const SecurityGroupShowRulesAction = {
  name: 'SECURITY_GROUP_PAGE.ACTION.RULES',
  command: SecurityGroupActionType.View,
  icon: 'visibility',
  canActivate: (securityGroup: SecurityGroup) => true
};

export class SecurityGroupActionService {
  public actions: Array<Action<SecurityGroup>> = [
    SecurityGroupShowRulesAction,
    SecurityGroupDeleteAction
  ];
}
