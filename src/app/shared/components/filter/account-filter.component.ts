import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { Account } from '../../models/account.model';

@Component({
  selector: 'cs-account-filter',
  templateUrl: 'account-filter.component.html'
})
export class AccountFilterComponent {
  @Input() public selectedAccountIds: string[] = [];
  @Input() public accounts: Array<Account>;
  @Output() public onChangeAccounts = new EventEmitter<Array<string>>();

  public changeAccount() {
    this.onChangeAccounts.emit(this.selectedAccountIds);
  }
}
