import { Component } from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import { AuthService } from '../../shared/services/auth.service';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import * as accountActions from '../../reducers/accounts/redux/accounts.actions';

@Component({
  selector: 'cs-account-users-container',
  template: `
    <cs-account-users
      [account]="account$ | async"
      (onUserRegenerateKey)="generateUserKeys($event)"
      (onUserDelete)="deleteUser($event)"
    ></cs-account-users>`
})
export class AccountUsersContainerComponent {
  readonly account$ = this.store.select(fromAccounts.getSelectedAccount);

  constructor(
    private store: Store<State>,
    private authService: AuthService
  ) {
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }

  public generateUserKeys(user) {
    this.store.dispatch(new accountActions.AccountUserGenerateKey(user));
  }

  public deleteUser(account) {
    this.store.dispatch(new accountActions.AccountUserDelete(account));
  }
}
