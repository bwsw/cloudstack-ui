import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AccountUser } from '../../../shared/models/account-user.model';
import { Account } from '../../../shared/models/account.model';
import { AccountUserEditContainerComponent } from '../../account-container/account-user-edit.container';
import { AccountUserPasswordFormContainerComponent } from '../../account-container/account-user-password.container';

@Component({
  selector: 'cs-account-users',
  templateUrl: 'account-users.component.html',
})
export class AccountUsersComponent {
  @Input()
  public account: Account;
  @Input()
  public isAdmin: boolean;
  @Input()
  public currentUserId: string;

  @Output()
  public userDeleted = new EventEmitter<AccountUser>();
  @Output()
  public userRegenerateKey = new EventEmitter<AccountUser>();
  @Output()
  public loadUserKeys = new EventEmitter<AccountUser>();

  public step: string;

  public get sortedUsers(): AccountUser[] {
    return this.account && this.account.user
      ? [...this.account.user].sort((u1, u2) => u1.firstname.localeCompare(u2.firstname))
      : [];
  }

  constructor(private dialog: MatDialog) {}

  public addUser() {
    this.openUserFormDialog();
  }

  public deleteUser(user) {
    this.userDeleted.emit(user);
  }

  public editUser(user) {
    this.openUserFormDialog(user);
  }

  public regenerateKeys(user) {
    this.userRegenerateKey.emit(user);
    this.setStep(user.id);
  }

  public onUserChangePassword(user) {
    this.dialog
      .open(AccountUserPasswordFormContainerComponent, {
        width: '375px',
        data: { user },
      })
      .afterClosed()
      .subscribe(() => this.setStep(user.id));
  }

  public setStep(userId) {
    this.step = userId;
  }

  public openItem(user) {
    this.setStep(user.id);
    if (user.apikey && !user.secretkey) {
      this.loadUserKeys.emit(user);
    }
  }

  private openUserFormDialog(user?: AccountUser) {
    this.dialog
      .open(AccountUserEditContainerComponent, {
        width: '375px',
        data: {
          user,
          title: !user ? 'ACCOUNT_PAGE.USER.CREATE_USER' : null,
          confirmButtonText: !user ? 'COMMON.CREATE' : null,
          account: this.account,
        },
      })
      .afterClosed()
      .subscribe(updatedUser => {
        if (updatedUser) {
          this.setStep(updatedUser.id);
        }
      });
  }
}
