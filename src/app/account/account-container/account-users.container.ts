import {  Component,  OnInit} from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import { AuthService } from '../../shared/services/auth.service';
import { Account } from '../../shared/models/account.model';

@Component({
  selector: 'cs-account-users-container',
  template: `
    <cs-account-users [account]="account$ | async"></cs-account-users>`
})
export class AccountUsersContainerComponent implements OnInit {
  readonly account$ = this.store.select(fromAccounts.getSelectedAccount);
  public account: Account;


  constructor(
    private store: Store<State>,
    private authService: AuthService
  ) {
  }

  public ngOnInit() {
  }


  public isAdmin() {
    return this.authService.isAdmin();
  }

}
