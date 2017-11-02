import { Injectable } from '@angular/core';
import { BaseAccountAction } from './base-account-action';
import { Account } from '../../../models/account.model';

@Injectable()
export class AccountLockAction implements BaseAccountAction {
  public name = 'ACCOUNT_ACTION.LOCK';
  public command = 'lock';
  public icon = 'block';

  public confirmMessage = 'DIALOG_MESSAGES.ACCOUNT.CONFIRM_LOCK';

  public canActivate(account: Account): boolean {
    return account.state !== 'locked';
  }
}
