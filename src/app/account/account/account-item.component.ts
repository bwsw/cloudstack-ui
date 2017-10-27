import { EventEmitter } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { AuthService } from '../../shared/services/auth.service';
import { Account } from '../../shared/models/account.model';
import { stateTranslations } from '../account-container/account.container';

export class AccountItemComponent {
  public item: Account;
  public isSelected: (account) => boolean;
  public onClick = new EventEmitter<Account>();
  public onAccountChanged = new EventEmitter<Account>();
  public mdMenuTrigger: MatMenuTrigger;

  readonly stateTranslations = stateTranslations;

  constructor(protected authService: AuthService) {
  }

  public handleClick(e: MouseEvent): void {
    e.stopPropagation();
    if (!this.mdMenuTrigger || !this.mdMenuTrigger.menuOpen) {
      this.onClick.emit(this.item);
    }
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }
}
