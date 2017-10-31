import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { BaseAccountAction } from './actions/base-account-action';
import { AccountActionsService } from './account-actions.service';
import { Account } from '../../models/account.model';

@Component({
  selector: 'cs-account-actions',
  templateUrl: 'account-actions.component.html'
})
export class AccountActionsComponent {
  @Input() public account: Account;
  @Output() public onAccountLock: EventEmitter<Account>;
  @Output() public onAccountEnable: EventEmitter<Account>;
  @Output() public onAccountDisable: EventEmitter<Account>;
  @Output() public onAccountDelete: EventEmitter<Account>;

  public actions: Array<BaseAccountAction>;

  constructor(
    private accountActionService: AccountActionsService
  ) {
    this.actions = this.accountActionService.actions;
    this.onAccountLock = new EventEmitter<Account>();
    this.onAccountEnable = new EventEmitter<Account>();
    this.onAccountDisable = new EventEmitter<Account>();
    this.onAccountDelete = new EventEmitter<Account>();
  }

  public activateAction(action: BaseAccountAction, account: Account) {
    action.activate().subscribe(() =>{
      switch (action.command) {
        case 'lock': {
          this.onAccountLock.emit(account);
          break;
        }
        case 'enable': {
          this.onAccountEnable.emit(account);
          break;
        }
        case 'disable': {
          this.onAccountDisable.emit(account);
          break;
        }
        case 'delete': {
          this.onAccountDelete.emit(account);
          break;
        }
      }
    });
  }

}
