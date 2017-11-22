import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account } from '../../../shared/models/account.model';
import { AccountUser } from '../../../shared/models/account-user.model';
import { MatDialog } from '@angular/material';
import { AccountUserEditContainerComponent } from '../../account-container/account-user-edit.container';

@Component({
  selector: 'cs-account-users',
  templateUrl: 'account-users.component.html',
})
export class AccountUsersComponent {
  @Input() public account: Account;
  @Output() public onUserDelete = new EventEmitter<any>();

  public query: string;

  public get sortedUsers() {
    return this.account && this.account.user && [...this.account.user]
      .sort((u1, u2) => u1.firstname < u2.firstname ? -1 : 1);
  }

  constructor(private dialog: MatDialog) {
  }

  public addUser() {
    this.openUserFormDialog();
  }

  public deleteUser(user) {
    this.onUserDelete.emit(user);
  }

  public editUser(user) {
    this.openUserFormDialog(user);
  }

  public onUserRegenerateKey(user) {
  }

  public onUserChangePassword(user) {
  }

  private openUserFormDialog(user?: AccountUser) {
    this.dialog.open(AccountUserEditContainerComponent, {
      width: '375px',
      data: {
        title: !user ? 'ACCOUNT_PAGE.CREATION.CREATE_USER' : null,
        confirmButtonText: !user ? 'COMMON.CREATE' : null,
        account: this.account,
        user
      }
    });
  }
}
