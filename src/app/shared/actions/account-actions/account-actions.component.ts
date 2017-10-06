import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseAccountAction } from './actions/base-account-action';
import { AccountActionsService } from './account-actions.service';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/account.model';

@Component({
  selector: 'cs-account-actions',
  templateUrl: 'account-actions.component.html'
})
export class AccountActionsComponent {
  @Input() public account: Account;
  @Output() public onAccountChanged: EventEmitter<Account>;

  public actions: Array<BaseAccountAction>;

  constructor(
    private accountActionService: AccountActionsService,
    private accountService: AccountService
  ) {
    this.actions = this.accountActionService.actions;
    this.onAccountChanged = new EventEmitter<Account>();
    this.accountService.onAccountUpdated.subscribe(
      (account) => this.onAccountChanged.emit(account)
    );
  }

}
