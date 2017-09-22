import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { AccountItemComponent } from '../account/account-item.component';

@Component({
  selector: 'cs-account-list',
  templateUrl: 'account-list.component.html'
})
export class AccountListComponent {
  @Input() public accounts: Array<Account>;
  @Input() public viewMode: string;
  @Input() public groupings: Array<any>;
  @Output() public viewModeChange = new EventEmitter();

  public inputs;
  public outputs;

  public AccountItemComponent = AccountItemComponent;

  constructor(protected authService: AuthService) {

  }
}
