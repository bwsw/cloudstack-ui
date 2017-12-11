import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Role } from '../../shared/models/role.model';
import { Domain } from '../../shared/models/domain.model';
import { MatDialogRef } from '@angular/material';
import { TimeZone } from '../../shared/components/time-zone/time-zone.service';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { AccountData } from '../../shared/models/account.model';

@Component({
  selector: 'cs-account-creation-dialog',
  templateUrl: 'account-creation-dialog.component.html'
})
export class AccountCreationDialogComponent {
  public hide = true;
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
    for (const key in data) {
      if (data[key] && data[key] !== '') {
        result[key] = key === 'timezone' ? data[key].geo : data[key];
      }
    }
    return result;
  }
}
