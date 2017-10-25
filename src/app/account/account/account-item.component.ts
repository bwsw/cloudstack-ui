import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { AuthService } from '../../shared/services/auth.service';
import { Account } from '../../shared/models/account.model';
import { stateTranslations } from '../account-container/account.container';

@Component({
  selector: 'cs-account-item',
  templateUrl: 'account-item.component.html',
  styleUrls: ['account-item.component.scss']
})
export class AccountItemComponent {
  @Input() public item: Account;
  @Input() public isSelected: (account) => boolean;
  @Output() public onClick = new EventEmitter<Account>();
  @Output() public onAccountChanged = new EventEmitter<Account>();
  @ViewChild(MatMenuTrigger) public mdMenuTrigger: MatMenuTrigger;

  readonly stateTranslations = stateTranslations;

  constructor(private authService: AuthService) {
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
