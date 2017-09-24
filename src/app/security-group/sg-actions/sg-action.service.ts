import { Injectable } from '@angular/core';
import { ActionsService } from '../../shared/interfaces/action-service.interface';
import { SecurityGroup } from '../sg.model';
import { SecurityGroupAction } from './sg-action';
import { SecurityGroupEditAction } from './sg-edit';
import { SecurityGroupRemoveAction } from './sg-remove';
import { SecurityGroupViewAction } from './sg-view';


@Injectable()
export class SecurityGroupActionsService implements ActionsService<SecurityGroup, SecurityGroupAction> {
  public actions = [
    this.securityGroupEditAction,
    this.securityGroupViewAction,
    this.securityGroupRemoveAction
  ];

  constructor(
    public securityGroupViewAction: SecurityGroupViewAction,
    public securityGroupEditAction: SecurityGroupEditAction,
    public securityGroupRemoveAction: SecurityGroupRemoveAction
  ) {}
}
