import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountItemComponent } from '../account/account-item.component';
import { Account } from '../../shared/models/account.model';
import { ListService } from '../../shared/components/list/list.service';

@Component({
  selector: 'cs-account-list',
  templateUrl: 'account-list.component.html'
})
export class AccountListComponent {
  @Input() public accounts: Array<Account>;
  @Input() public groupings: Array<any>;
  @Output() public viewModeChange = new EventEmitter();

  public inputs;
  public outputs;

  public AccountItemComponent = AccountItemComponent;

  constructor(public listService: ListService) {
    this.inputs = {
      isSelected: (item: Account) => this.listService.isSelected(item.id)
    };

    this.outputs = {
      onClick: this.selectAccount.bind(this),
    };
  }

  public selectAccount(account: Account): void {
    this.listService.showDetails(account.id);
  }
}
