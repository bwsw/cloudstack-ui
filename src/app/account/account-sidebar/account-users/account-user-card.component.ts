import { Component, Input } from '@angular/core';
import { AccountUser } from '../../../shared/models/account-user.model';

@Component({
  selector: 'cs-account-user-card',
  templateUrl: 'account-user-card.component.html',
})
export class AccountUserCardComponent {
  @Input()
  public user: AccountUser;
}
