import { Component, Inject } from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import { Account } from '../../shared/models/account.model';
import { AccountUser } from '../../shared/models/account-user.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import * as accountActions from '../../reducers/accounts/redux/accounts.actions';

@Component({
  selector: 'cs-account-user-edit-container',
  template: `
    <cs-account-user-edit
      [title]="title"
      [confirmButtonText]="confirmButtonText"
      [user]="user"
      (updateUser)="updateUser($event)"
    ></cs-account-user-edit>`,
})
export class AccountUserEditContainerComponent {
  public account: Account;
  public user: AccountUser;
  public title: string;
  public confirmButtonText: string;

  constructor(
    private dialogRef: MatDialogRef<AccountUserEditContainerComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private store: Store<State>,
  ) {
    this.title = data.title;
    this.user = { ...data.user };
    this.account = data.account;
    this.confirmButtonText = data.confirmButtonText;
  }

  public updateUser(user: AccountUser) {
    if (!this.user || !this.user.id) {
      user.account = (this.account && this.account.name) || user.username;

      if (this.account) {
        user.domainid = this.account.domainid;
      }

      this.store.dispatch(new accountActions.AccountUserCreate(user));
    } else {
      this.user.username = user.username;
      this.user.firstname = user.firstname;
      this.user.lastname = user.lastname;
      this.user.email = user.email;
      this.user.timezone = user.timezone;
      this.store.dispatch(new accountActions.AccountUserUpdate(this.user));
    }

    this.dialogRef.close(this.user);
  }
}
