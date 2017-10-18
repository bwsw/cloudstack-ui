import { Injectable } from '@angular/core';
import { ActionsService } from '../../shared/interfaces/action-service.interface';
import { SecurityGroup } from '../sg.model';
import { SecurityGroupAction } from './sg-action';
import { SecurityGroupRemoveAction } from './sg-remove';
import { SecurityGroupViewAction } from './sg-view';


@Injectable()
export class SecurityGroupActionsService implements ActionsService<SecurityGroup, SecurityGroupAction> {
  public actions = [
    this.securityGroupViewAction,
    this.securityGroupRemoveAction
  ];

  constructor(
    public securityGroupViewAction: SecurityGroupViewAction,
    public securityGroupRemoveAction: SecurityGroupRemoveAction
  ) {}
}
