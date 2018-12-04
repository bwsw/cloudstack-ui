import { EventEmitter } from '@angular/core';
import { Account } from '../../shared/models';
import { AuthService } from '../../shared/services/auth.service';
import { isUserBelongsToAccount } from '../../shared/utils/account';
import { stateTranslations } from '../account-container/account.container';

export class AccountItemComponent {
  public item: Account;
  public isSelected: (account) => boolean;
  public onClick = new EventEmitter<Account>();

  readonly stateTranslations = stateTranslations;

  public get isSelf() {
    return isUserBelongsToAccount(this.authService.user, this.item);
  }

  constructor(protected authService: AuthService) {}

  public handleClick(): void {
    this.onClick.emit(this.item);
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }
}
