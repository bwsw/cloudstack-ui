import { Component, EventEmitter, Output } from '@angular/core';
import { Account } from '../../models/account.model';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'cs-account-filter',
  templateUrl: 'account-filter.component.html'
})
export class AccountFilterComponent {
  @Output() public onChangeAccount = new EventEmitter<Array<Account>>();
  public selected;
  public users: Array<Account>;

  constructor (private accountService: AccountService) {
    this.accountService.getList().subscribe((users) => {
      this.users = users;
    });
  }

  public changeAccount() {
    this.onChangeAccount.emit(this.selected);
  }
}
