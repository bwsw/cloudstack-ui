import { Injectable } from '@angular/core';
import { BaseAccountAction } from './base-account-action';
import { Account } from '../../../models/account.model';


@Injectable()
export class AccountEnableAction implements BaseAccountAction {
  public name = 'ACCOUNT_ACTION.ENABLE';
  public command = 'enable';
  public icon = 'remove_circle_outline';

  public confirmMessage = 'DIALOG_MESSAGES.ACCOUNT.CONFIRM_ENABLE';

  public canActivate(account: Account): boolean {
    return account.state !== 'enabled';
  }
}
