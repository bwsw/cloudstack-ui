import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { AccountCardItemComponent } from '../account/card-item/account-card-item.component';
import { Account } from '../../shared/models/account.model';
import { ListService } from '../../shared/components/list/list.service';
import { ViewMode } from '../../shared/components/filter/filter-panel.component';
import { AccountRowItemComponent } from '../account/row-item/account-row-item.component';

@Component({
  selector: 'cs-account-list',
  templateUrl: 'account-list.component.html'
})
export class AccountListComponent {
  @Input() public accounts: Array<Account>;
  @Input() public groupings: Array<any>;
  @Input() public mode: ViewMode;
  @Output() public viewModeChange = new EventEmitter();
  @Output() public onAccountChanged = new EventEmitter<Account>();

  public inputs;
  public outputs;

  public AccountCardItemComponent = AccountCardItemComponent;
  public AccountRowItemComponent = AccountRowItemComponent;

  constructor(public listService: ListService) {
    this.inputs = {
      isSelected: (item: Account) => this.listService.isSelected(item.id)
    };

    this.outputs = {
      onClick: this.selectAccount.bind(this),
      onAccountChanged: this.changeAccount.bind(this)
    };
  }

  public selectAccount(account: Account): void {
    this.listService.showDetails(account.id);
  }

  public changeAccount(account: Account): void {
    this.onAccountChanged.emit(account);
  }
}
