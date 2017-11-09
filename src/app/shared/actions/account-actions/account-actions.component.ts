import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { AccountActionsService } from './account-actions.service';
import { Account } from '../../models/account.model';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';

@Component({
  selector: 'cs-account-actions',
  templateUrl: 'account-actions.component.html'
})
export class AccountActionsComponent {
  @Input() public account: Account;
  @Output() public onAccountLock: EventEmitter<Account> = new EventEmitter<Account>();
  @Output() public onAccountEnable: EventEmitter<Account> = new EventEmitter<Account>();
  @Output() public onAccountDisable: EventEmitter<Account> = new EventEmitter<Account>();
  @Output() public onAccountDelete: EventEmitter<Account> = new EventEmitter<Account>();

  public actions: any[];

  constructor(
    private accountActionsService: AccountActionsService,
    private dialogService: DialogService
  ) {
    this.actions = this.accountActionsService.actions;
  }

  public activateAction(action, account: Account) {
    this.dialogService.confirm({ message: action.confirmMessage })
      .onErrorResumeNext()
      .filter(res => Boolean(res))
      .subscribe(() => {
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
