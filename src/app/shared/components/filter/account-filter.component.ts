import {Component, EventEmitter, Output} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models/user.model';

@Component({
  selector: 'cs-account-filter',
  templateUrl: 'account-filter.component.html'
})
export class AccountFilterComponent {
  @Output() public onChangeAccount = new EventEmitter<Array<User>>();
  public selected;
  public users: Array<User>;

  constructor (private userService: UserService) {
    this.userService.getList().subscribe((users) => {
      this.users = users;
    });
  }

  public changeAccount() {
    this.onChangeAccount.emit(this.selected);
  }
}