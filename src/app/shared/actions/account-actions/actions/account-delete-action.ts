import { Injectable } from '@angular/core';
import { BaseAccountAction } from './base-account-action';


@Injectable()
export class AccountDeleteAction implements BaseAccountAction {
  public name = 'ACCOUNT_ACTION.DELETE';
  public command = 'delete';
  public icon = 'delete';

  public confirmMessage = 'DIALOG_MESSAGES.ACCOUNT.CONFIRM_DELETION';

  public canActivate = (account: Account) => true;
}
