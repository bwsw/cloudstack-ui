import { Component, Input } from '@angular/core';
import { Account } from '../../../shared/models/account.model';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'cs-account-detail',
  templateUrl: 'account-details.component.html',
})
export class AccountDetailsComponent {
  @Input()
  public account: Account;

  constructor(private authService: AuthService) {}

  public isAdmin() {
    return this.authService.isAdmin();
  }
}
