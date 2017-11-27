import { Injectable } from '@angular/core';
import { ActionsService } from '../../shared/interfaces/action-service.interface';
import { SecurityGroup } from '../sg.model';
import { SecurityGroupAction } from './sg-action';
import { SecurityGroupRemoveAction } from './sg-remove';
import { SecurityGroupRulesAction } from './sg-rules';


@Injectable()
export class SecurityGroupActionsService implements ActionsService<SecurityGroup, SecurityGroupAction> {
  public actions = [
    this.securityGroupRulesAction,
    this.securityGroupRemoveAction
  ];

  constructor(
    public securityGroupRulesAction: SecurityGroupRulesAction,
    public securityGroupRemoveAction: SecurityGroupRemoveAction
  ) {}
}
