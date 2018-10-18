import { Account, Action } from '../../models';

const accountDeleteAction = {
  name: 'ACCOUNT_ACTION.DELETE',
  command: 'delete',
  icon: 'mdi-delete',
  confirmMessage: 'DIALOG_MESSAGES.ACCOUNT.CONFIRM_DELETION',
  canActivate: (account: Account) => true,
};

const accountDisableAction = {
  name: 'ACCOUNT_ACTION.DISABLE',
  command: 'disable',
  icon: 'mdi-minus-circle',
  confirmMessage: 'DIALOG_MESSAGES.ACCOUNT.CONFIRM_DISABLE',
  canActivate: (account: Account) => account.state !== 'disabled',
};

const accountEnableAction = {
  name: 'ACCOUNT_ACTION.ENABLE',
  command: 'enable',
  icon: 'mdi-minus-circle-outline',
  confirmMessage: 'DIALOG_MESSAGES.ACCOUNT.CONFIRM_ENABLE',
  canActivate: (account: Account) => account.state !== 'enabled',
};

export class AccountActionsService {
  public actions: Action<Account>[] = [
    accountDisableAction,
    accountEnableAction,
    accountDeleteAction,
  ];
}
