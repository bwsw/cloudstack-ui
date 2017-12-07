import {
  Component,
  EventEmitter,
  Input,
  OnInit,
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
export class AccountUserEditComponent implements OnInit {
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
      firstname: this.formBuilder.control('', [ Validators.required ]),
      lastname: this.formBuilder.control('', [ Validators.required ]),
      timezone: this.formBuilder.control(null),
    });

  }

  ngOnInit() {
    if (this.title) {
      this.userForm.addControl('password', this.formBuilder.control('', [ Validators.required ]));
    }
    if (!this.title) {
      this.userForm.setValue({
        username: this.username,
        email: this.email,
        firstname: this.firstName,
        lastname: this.lastName,
        timezone: this.timezone,
      });
    }
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
        result[key] = key === 'timezone' ? data[key].geo : data[key];
      }
    }
    return result;
  }
}
