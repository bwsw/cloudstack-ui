import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account } from '../../../shared/models/account.model';
import { AuthService } from '../../../shared/services/auth.service';
import { AccountItemComponent } from '../account-item.component';

@Component({
  selector: 'cs-account-card-item',
  templateUrl: 'account-card-item.component.html',
  styleUrls: ['account-card-item.component.scss'],
})
export class AccountCardItemComponent extends AccountItemComponent {
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
