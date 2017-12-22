import { Injectable } from '@angular/core';
import { AccountType } from '../../models/account.model';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AccountUserActionsService {
  public actions = [
    {
      name: 'ACCOUNT_USER_ACTION.EDIT',
      command: 'edit',
      icon: 'edit',
      canActivate: user => user.accounttype !== AccountType.User
    },
    {
      name: 'ACCOUNT_USER_ACTION.CHANGE_PASSWORD',
      command: 'changePassword',
      icon: 'lock',
      canActivate: user => true
    },
    {
      name: 'ACCOUNT_USER_ACTION.REGENERATE_KEY',
      command: 'regenerateKey',
      icon: 'vpn_key',
      confirmMessage: 'DIALOG_MESSAGES.ACCOUNT_USER.CONFIRM_REGENERATE_KEY',
      canActivate: user => true
    },
    {
      name: 'ACCOUNT_USER_ACTION.DELETE',
      command: 'delete',
      icon: 'delete',
      confirmMessage: 'DIALOG_MESSAGES.ACCOUNT_USER.CONFIRM_DELETION',
      canActivate: user => user.id !== this.authService.user.userId
    }
  ];

  constructor(protected authService: AuthService) {
  }
}
