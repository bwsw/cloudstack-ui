import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AccountUser } from '../../../shared/models/account-user.model';
import { Account, AccountType } from '../../../shared/models/account.model';
import { AccountUserEditContainerComponent } from '../../account-container/account-user-edit.container';
import { AccountUserPasswordFormContainerComponent } from '../../account-container/account-user-password.container';

@Component({
  selector: 'cs-account-users',
  templateUrl: 'account-users.component.html',
})
export class AccountUsersComponent {
  @Input() public account: Account;

  @Output() public onUserDelete = new EventEmitter<AccountUser>();
  @Output() public onUserRegenerateKey = new EventEmitter<AccountUser>();

  public step: string;

  public get sortedUsers(): Array<AccountUser> {
    return this.account && [...this.account.user]
      .sort((u1, u2) => u1.firstname.localeCompare(u2.firstname));
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

  public regenerateKeys(user) {
    this.onUserRegenerateKey.emit(user);
    this.setStep(user.id)
  }

  public get isAdmin(): boolean {
    return this.account && this.account.accounttype !== AccountType.User;
  }

  public onUserChangePassword(user) {
    this.dialog.open(AccountUserPasswordFormContainerComponent, {
      width: '375px',
      data: {
        userId: user.id
      }
    })
      .afterClosed()
      .subscribe(() => this.setStep(user.id));
  }

  public setStep(userId) {
    this.step = userId;
  }

  private openUserFormDialog(user?: AccountUser) {
    this.dialog.open(AccountUserEditContainerComponent, {
      width: '375px',
      data: {
        title: !user ? 'ACCOUNT_PAGE.USER.CREATE_USER' : null,
        confirmButtonText: !user ? 'COMMON.CREATE' : null,
        account: this.account,
        user
      }
    })
      .afterClosed()
      .subscribe(updatedUser => {
        if (updatedUser) {
          this.setStep(updatedUser.id);
        }
      });
  }
}
