import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as accountActions from '../../reducers/accounts/redux/accounts.actions';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import { State } from '../../reducers/index';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'cs-account-users-container',
  template: `
    <cs-account-users
      [account]="account$ | async"
      [isAdmin]="isAdmin()"
      [currentUserId]="currentUserId()"
      (onUserRegenerateKey)="generateUserKeys($event)"
      (onUserDelete)="deleteUser($event)"
      (onLoadUserKeys)="loadUserKeys($event)"
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

  public currentUserId() {
    return this.authService.user.userId;
  }

  public generateUserKeys(user) {
    this.store.dispatch(new accountActions.AccountUserGenerateKey(user));
  }

  public deleteUser(account) {
    this.store.dispatch(new accountActions.AccountUserDelete(account));
  }

  public loadUserKeys(user) {
    this.store.dispatch(new accountActions.AccountLoadUserKeys(user));
  }
}
