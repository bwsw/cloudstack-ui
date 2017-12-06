import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { AccountUser } from '../../../shared/models/account-user.model';
import { TimeZone } from '../../../shared/components/time-zone/time-zone.service';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

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

  public userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      username: this.formBuilder.control('', [ Validators.required ]),
      email: this.formBuilder.control('', [ Validators.required, Validators.email ]),
      password: this.formBuilder.control('', [ Validators.required ]),
      firstname: this.formBuilder.control('', [ Validators.required ]),
      lastname: this.formBuilder.control('', [ Validators.required ]),
      timezone: this.formBuilder.control(null),
    });
  }

  public loading = false;
  public hide = true;

  public onUserUpdate() {
    const newUser = this.prepareData(this.userForm.value);
    this.updateUser.emit(newUser);
  }

  public prepareData(data: {}): AccountUser {
    let result: AccountUser = new AccountUser();
    for (const key in data) {
      if (data[key] && data[key] !== '') {
        result[key] = data[key];
      }
    }
    return result;
  }
}
