import { Account } from '../../models/account.model';
import { Action } from '../../models/action.model';

const AccountDeleteAction = {
  name: 'ACCOUNT_ACTION.DELETE',
  command: 'delete',
  icon: 'delete',
  confirmMessage: 'DIALOG_MESSAGES.ACCOUNT.CONFIRM_DELETION',
  canActivate: (account: Account) => true
};

const AccountDisableAction = {
  name: 'ACCOUNT_ACTION.DISABLE',
  command: 'disable',
  icon: 'remove_circle',
  confirmMessage: 'DIALOG_MESSAGES.ACCOUNT.CONFIRM_DISABLE',
  canActivate: (account: Account) => account.state !== 'disabled'
};

const AccountEnableAction = {
  name: 'ACCOUNT_ACTION.ENABLE',
  command: 'enable',
  icon: 'remove_circle_outline',
  confirmMessage: 'DIALOG_MESSAGES.ACCOUNT.CONFIRM_ENABLE',
  canActivate: (account: Account) => account.state !== 'enabled'
};

export class AccountActionsService {
  public actions: Array<Action<Account>> = [
    AccountDisableAction,
    AccountEnableAction,
    AccountDeleteAction
  ];
}
