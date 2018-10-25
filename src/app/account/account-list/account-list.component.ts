import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountCardItemComponent } from '../account/card-item/account-card-item.component';
import { Account } from '../../shared/models/account.model';
import { ListService } from '../../shared/components/list/list.service';
import { ViewMode } from '../../shared/components/view-mode-switch/view-mode-switch.component';
import { AccountRowItemComponent } from '../account/row-item/account-row-item.component';

@Component({
  selector: 'cs-account-list',
  templateUrl: 'account-list.component.html',
})
export class AccountListComponent {
  @Input()
  public accounts: Account[];
  @Input()
  public groupings: any[];
  @Input()
  public mode: ViewMode;
  @Output()
  public viewModeChange = new EventEmitter();

  public inputs;
  public outputs;

  constructor(public listService: ListService) {
    this.inputs = {
      isSelected: (item: Account) => this.listService.isSelected(item.id),
    };

    this.outputs = {
      onClick: this.selectAccount.bind(this),
    };
  }

  public get itemComponent() {
    return this.mode === ViewMode.BOX ? AccountCardItemComponent : AccountRowItemComponent;
  }

  public selectAccount(account: Account): void {
    this.listService.showDetails(account.id);
  }
}
