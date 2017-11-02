import { Injectable } from '@angular/core';
import { BaseAccountAction } from './base-account-action';
import { Account } from '../../../models/account.model';

@Injectable()
export class AccountDisableAction implements BaseAccountAction {
  public name = 'ACCOUNT_ACTION.DISABLE';
  public command = 'disable';
  public icon = 'remove_circle';

  public confirmMessage = 'DIALOG_MESSAGES.ACCOUNT.CONFIRM_DISABLE';

  public canActivate(account: Account): boolean {
    return account.state !== 'disabled';
  }
}
