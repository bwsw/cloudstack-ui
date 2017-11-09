import { Account } from '../../models/account.model';

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

const AccountLockAction = {
  name: 'ACCOUNT_ACTION.LOCK',
  command: 'lock',
  icon: 'block',
  confirmMessage: 'DIALOG_MESSAGES.ACCOUNT.CONFIRM_LOCK',
  canActivate: (account: Account) => account.state !== 'locked'
};

export class AccountActionsService {
  public actions = [
    AccountDisableAction,
    AccountEnableAction,
    AccountLockAction,
    AccountDeleteAction
  ];
}
