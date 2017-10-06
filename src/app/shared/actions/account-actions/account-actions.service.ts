import { Injectable } from '@angular/core';
import { ActionsService } from '../../interfaces/action-service.interface';
import { Action } from '../../interfaces/action.interface';
import { AccountDeleteAction } from './actions/account-delete-action';
import { AccountDisableAction } from './actions/account-disable-action';
import { Account } from '../../models/account.model';
import { AccountEnableAction } from './actions/account-enable-action';
import { AccountLockAction } from './actions/account-lock-action';


@Injectable()
export class AccountActionsService implements ActionsService<Account, Action<Account>> {
  public actions = [
    this.accountDisableAction,
    this.accountEnableAction,
    this.accountLockAction,
    this.accountDeleteAction
  ];

  constructor(
    public accountDeleteAction: AccountDeleteAction,
    public accountDisableAction: AccountDisableAction,
    public accountEnableAction: AccountEnableAction,
    public accountLockAction: AccountLockAction
  ) {}
}
