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

export class AccountData {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  domainid: string;
  account: string;
  roleid: string;
  timezone: TimeZone;
  networkdomain: string;
}

@Component({
  selector: 'cs-account-creation-dialog',
  templateUrl: 'account-creation-dialog.component.html'
})
export class AccountCreationDialogComponent {
  public newAccount = new AccountData();

  @Input() public isLoading: boolean;
  @Input() public domains: Domain[];
  @Input() public roles: Role[];
  @Output() public onAccountCreate = new EventEmitter<AccountData>();

  constructor(
    private dialogRef: MatDialogRef<AccountCreationDialogComponent>,
  ) { }

  public onSubmit(e): void {
    e.preventDefault();
    const accountCreationParams = Object.assign({}, this.newAccount);
    this.onAccountCreate.emit(accountCreationParams);
    this.dialogRef.close();
  }
}
