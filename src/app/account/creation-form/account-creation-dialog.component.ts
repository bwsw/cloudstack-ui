import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { AccountData } from '../../shared/models/account.model';
import { Domain } from '../../shared/models/domain.model';
import { Role } from '../../shared/models/role.model';

@Component({
  selector: 'cs-account-creation-dialog',
  templateUrl: 'account-creation-dialog.component.html'
})
export class AccountCreationDialogComponent {
  public showPassword = true;
  public accountForm: FormGroup;

  @Input() public isLoading: boolean;
  @Input() public domains: Domain[];
  @Input() public roles: Role[];
  @Output() public onAccountCreate = new EventEmitter<AccountData>();

  constructor(
    private dialogRef: MatDialogRef<AccountCreationDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.accountForm = this.formBuilder.group({
      username: this.formBuilder.control('', [ Validators.required ]),
      email: this.formBuilder.control('', [ Validators.required, Validators.email ]),
      password: this.formBuilder.control('', [ Validators.required ]),
      firstname: this.formBuilder.control('', [ Validators.required ]),
      lastname: this.formBuilder.control('', [ Validators.required ]),
      domainid: this.formBuilder.control('', [ Validators.required ]),
      roleid: this.formBuilder.control(''),
      account: this.formBuilder.control(null),
      timezone: this.formBuilder.control(null),
      networkdomain: this.formBuilder.control(null),
    });
  }

  public onSubmit(e): void {
    e.preventDefault();
    const accountCreationParams = this.prepareData(this.accountForm.value);
    this.onAccountCreate.emit(accountCreationParams);
    this.dialogRef.close();
  }

  public prepareData(data: {}): AccountData {
    let result: AccountData = new AccountData();
    result.username = data['username'];
    result.email = data['email'];
    result.password = data['password'];
    result.firstname = data['firstname'];
    result.lastname = data['lastname'];
    result.roleid = data['roleid'];
    result.domainid = data['domainid'];
    if (data['timezone']) {
      result.timezone = data['timezone'].geo;
    }
    if (data['account']) {
      result.account = data['account'];
    }
    if (data['networkdomain']) {
      result.networkdomain = data['networkdomain'];
    }

    return result;
  }
}
