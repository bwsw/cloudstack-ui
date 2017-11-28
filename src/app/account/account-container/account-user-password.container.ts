import { Component, Inject } from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import * as accountActions from '../../reducers/accounts/redux/accounts.actions';

@Component({
  selector: 'cs-account-user-edit-container',
  template: `
    <cs-account-user-password-form
      (changePassword)="changePassword($event)"
    ></cs-account-user-password-form>`
})
export class AccountUserPasswordFormContainerComponent {
  public userId: string;

  constructor(
    private dialogRef: MatDialogRef<AccountUserPasswordFormContainerComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private store: Store<State>
  ) {
    this.userId = data.userId;
  }

  public changePassword(password: string) {
    this.store.dispatch(new accountActions.AccountUserUpdate({
      id: this.userId,
      password: password
    }));
    this.dialogRef.close();
  }
}
