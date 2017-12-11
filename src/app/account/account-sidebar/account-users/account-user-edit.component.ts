import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { AccountUser } from '../../../shared/models/account-user.model';
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
  @Input() public user: AccountUser;

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
    } else {
      this.userForm.patchValue(this.user);
    }
  }


  public loading = false;
  public showPassword = true;

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
