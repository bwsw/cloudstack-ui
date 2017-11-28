import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account } from '../../models/account.model';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { AccountUserActionsService } from './account-user-actions.service';
import { AccountUser } from '../../models/account-user.model';

@Component({
  selector: 'cs-account-user-actions',
  templateUrl: 'account-user-actions.component.html'
})
export class AccountUserActionsComponent {
  @Input() public user: AccountUser;
  @Output() public onUserEdit: EventEmitter<Account> = new EventEmitter<Account>();
  @Output() public onUserChangePassword: EventEmitter<Account> = new EventEmitter<Account>();
  @Output() public onUserRegenerateKey: EventEmitter<Account> = new EventEmitter<Account>();
  @Output() public onUserDelete: EventEmitter<Account> = new EventEmitter<Account>();

  public actions: any[];

  constructor(
    private userActionService: AccountUserActionsService,
    private dialogService: DialogService
  ) {
    this.actions = this.userActionService.actions;
  }

  public activateAction(action, user) {
    if (action.confirmMessage) {
      this.dialogService.confirm({ message: action.confirmMessage })
        .onErrorResumeNext()
        .filter(res => Boolean(res))
        .subscribe(() => {
          switch (action.command) {
            case 'regenerateKey': {
              this.onUserRegenerateKey.emit(user);
              break;
            }
            case 'delete': {
              this.onUserDelete.emit(user);
              break;
            }
          }
        });
    } else {
      switch (action.command) {
        case 'edit': {
          this.onUserEdit.emit(user);
          break;
        }
        case 'changePassword': {
          this.onUserChangePassword.emit(user);
          break;
        }
      }
    }
  }
}
