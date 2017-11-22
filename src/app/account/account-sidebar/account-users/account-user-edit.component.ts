import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountUser } from '../../../shared/models/account-user.model';

@Component({
  selector: 'cs-account-user-edit',
  templateUrl: 'account-user-edit.component.html'
})
export class AccountUserEditComponent {
  @Input() public title: string;
  @Input() public confirmButtonText: string;

  @Input() public username: string;
  @Input() public firstName: string;
  @Input() public lastName: string;
  @Input() public email: string;
  @Input() public password: string;
  @Input() public timezone: string;

  @Output() public updateUser = new EventEmitter<AccountUser>();

  public loading = false;
  public hide = true;

  public onUserUpdate() {
    const newUser = new AccountUser({
      username: this.username,
      firstname: this.firstName,
      lastname: this.lastName,
      email: this.email,
      password: this.password,
    });

    this.updateUser.emit(newUser);
  }
}
