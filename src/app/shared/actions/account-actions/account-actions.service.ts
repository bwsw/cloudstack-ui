import { Injectable } from '@angular/core';
import { AccountDeleteAction } from './actions/account-delete-action';
import { AccountDisableAction } from './actions/account-disable-action';
import { AccountEnableAction } from './actions/account-enable-action';
import { AccountLockAction } from './actions/account-lock-action';


@Injectable()
export class AccountActionsService {
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
