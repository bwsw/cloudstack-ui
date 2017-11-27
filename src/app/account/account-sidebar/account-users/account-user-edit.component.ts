import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountUser } from '../../../shared/models/account-user.model';
import { TimeZone } from '../../../shared/components/time-zone/time-zone.service';

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
  @Input() public timezone: TimeZone;

  @Output() public updateUser = new EventEmitter<AccountUser>();

  public loading = false;
  public hide = true;

  public onUserUpdate() {
    const newUser: AccountUser = {
      username: this.username,
      firstname: this.firstName,
      lastname: this.lastName,
      email: this.email,
      password: this.password,
      timezone: this.timezone.geo
    };

    this.updateUser.emit(newUser);
  }
}
