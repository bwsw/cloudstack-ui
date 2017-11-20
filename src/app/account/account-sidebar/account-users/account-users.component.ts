import { Component, Input } from '@angular/core';
import { Account } from '../../../shared/models/account.model';
@Component({
  selector: 'cs-account-users',
  templateUrl: 'account-users.component.html'
})
export class AccountUsersComponent {
  @Input() public account: Account;
}
