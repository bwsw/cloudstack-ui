import { EventEmitter } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { AuthService } from '../../shared/services/auth.service';
import { Account } from '../../shared/models';
import { stateTranslations } from '../account-container/account.container';
import { isUserBelongsToAccount } from '../../shared/utils/account';

export class AccountItemComponent {
  public item: Account;
  public isSelected: (account) => boolean;
  public onClick = new EventEmitter<Account>();
  public matMenuTrigger: MatMenuTrigger;

  readonly stateTranslations = stateTranslations;

  public get isSelf() {
    return isUserBelongsToAccount(this.authService.user, this.item);
  }

  constructor(protected authService: AuthService) {}

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.matMenuTrigger || !this.matMenuTrigger.menuOpen) {
      this.onClick.emit(this.item);
    }
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }
}
