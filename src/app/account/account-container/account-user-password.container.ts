import { Component, Inject } from '@angular/core';
import { State } from '../../reducers';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AccountUser } from '../../shared/models/account-user.model';

import * as accountActions from '../../reducers/accounts/redux/accounts.actions';

@Component({
  selector: 'cs-account-user-password-container',
  template: `
    <cs-account-user-password-form
      (changePassword)="changePassword($event)"
    ></cs-account-user-password-form>`,
})
export class AccountUserPasswordFormContainerComponent {
  public user: AccountUser;

  constructor(
    private dialogRef: MatDialogRef<AccountUserPasswordFormContainerComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private store: Store<State>,
  ) {
    this.user = { ...data.user };
  }

  public changePassword(password: string) {
    this.store.dispatch(
      new accountActions.AccountUserUpdate({
        ...this.user,
        password,
      }),
    );
    this.dialogRef.close();
  }
}
