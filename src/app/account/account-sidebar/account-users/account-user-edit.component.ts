import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountUser, AccountUserForm } from '../../../shared/models/account-user.model';

@Component({
  selector: 'cs-account-user-edit',
  templateUrl: 'account-user-edit.component.html',
})
export class AccountUserEditComponent implements OnInit {
  @Input()
  public title: string;
  @Input()
  public confirmButtonText: string;
  @Input()
  public user: AccountUser;

  @Output()
  public updateUser = new EventEmitter<AccountUser>();

  public userForm: FormGroup;
  public loading = false;
  public showPassword = true;

  constructor(private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      username: this.formBuilder.control('', [Validators.required]),
      email: this.formBuilder.control('', [Validators.required, Validators.email]),
      firstname: this.formBuilder.control('', [Validators.required]),
      lastname: this.formBuilder.control('', [Validators.required]),
      timezone: this.formBuilder.control(null),
    });
  }

  ngOnInit() {
    if (this.user && this.user.id) {
      this.userForm.patchValue(this.user);
    } else {
      this.userForm.addControl('password', this.formBuilder.control('', [Validators.required]));
    }
  }

  public onUserUpdate() {
    const newUser = this.prepareData(this.userForm.value);
    this.updateUser.emit(newUser);
  }

  public prepareData(data: AccountUserForm): AccountUser {
    const result = {} as AccountUser;
    result.username = data.username;
    result.email = data.email;
    if (data.password) {
      result.password = data.password;
    }
    result.firstname = data.firstname;
    result.lastname = data.lastname;
    if (data.timezone) {
      result.timezone = data.timezone.geo;
    }
    return result;
  }
}
