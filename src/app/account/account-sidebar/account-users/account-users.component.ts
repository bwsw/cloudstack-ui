import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { Account } from '../../../shared/models/account.model';
import { AccountUser } from '../../../shared/models/account-user.model';
import { MatDialog } from '@angular/material';
import { AccountUserEditContainerComponent } from '../../account-container/account-user-edit.container';
import { AccountUserPasswordFormContainerComponent } from '../../account-container/account-user-password.container';

@Component({
  selector: 'cs-account-users',
  templateUrl: 'account-users.component.html',
})
export class AccountUsersComponent implements OnChanges {
  @Input() public account: Account;

  @Output() public onUserDelete = new EventEmitter<any>();
  @Output() public onUserRegenerateKey = new EventEmitter<any>();

  public step: string;

  constructor(private dialog: MatDialog) {
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.account && !changes.account.previousValue) {
      this.setStep(this.account && this.account.user && this.account.user[0].id);
    }
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

  public onUserChangePassword(user) {
    this.dialog.open(AccountUserPasswordFormContainerComponent, {
      width: '375px',
      data: {
        userId: user.id
      }
    });
  }

  public setStep(userId) {
    this.step = userId;
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
