import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account } from '../../../shared/models/account.model';
import { AuthService } from '../../../shared/services/auth.service';
import { AccountItemComponent } from '../account-item.component';

@Component({
  selector: 'cs-account-row-item',
  templateUrl: 'account-row-item.component.html',
  styleUrls: ['account-row-item.component.scss'],
})
export class AccountRowItemComponent extends AccountItemComponent {
  @Input()
  public item: Account;
  @Input()
  public isSelected: (account) => boolean;
  // tslint:disable-next-line:no-output-on-prefix
  @Output()
  public onClick = new EventEmitter<Account>();

  constructor(protected authService: AuthService) {
    super(authService);
  }
}
