import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Role } from '../../shared/models/role.model';
import { Domain } from '../../shared/models/domain.model';
import { AccountData } from '../../shared/models/account.model';

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

  public onSubmit(e): void {
    e.preventDefault();
    const accountCreationParams = Object.assign({}, this.newAccount);
    this.onAccountCreate.emit(accountCreationParams);
  }
}
