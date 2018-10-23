import { Component, EventEmitter, Input, Output } from '@angular/core';
import { filter, onErrorResumeNext } from 'rxjs/operators';

import { Account } from '../../models/account.model';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';
import { AccountUserActionsService } from './account-user-actions.service';
import { AccountUser } from '../../models/account-user.model';

@Component({
  selector: 'cs-account-user-actions',
  templateUrl: 'account-user-actions.component.html',
})
export class AccountUserActionsComponent {
  @Input()
  public user: AccountUser;
  @Output()
  public userEdited: EventEmitter<Account> = new EventEmitter<Account>();
  @Output()
  public userChangedPassword: EventEmitter<Account> = new EventEmitter<Account>();
  @Output()
  public userRegeneratedKey: EventEmitter<Account> = new EventEmitter<Account>();
  @Output()
  public userDeleted: EventEmitter<Account> = new EventEmitter<Account>();

  public actions: any[];

  constructor(
    private userActionService: AccountUserActionsService,
    private dialogService: DialogService,
  ) {
    this.actions = this.userActionService.actions;
  }

  public activateAction(action, user) {
    if (action.confirmMessage) {
      this.dialogService
        .confirm({ message: action.confirmMessage })
        .pipe(
          onErrorResumeNext(),
          filter(Boolean),
        )
        .subscribe(() => {
          switch (action.command) {
            case 'regenerateKey': {
              this.userRegeneratedKey.emit(user);
              break;
            }
            case 'delete': {
              this.userDeleted.emit(user);
              break;
            }
            default:
              break;
          }
        });
    } else {
      switch (action.command) {
        case 'edit': {
          this.userEdited.emit(user);
          break;
        }
        case 'changePassword': {
          this.userChangedPassword.emit(user);
          break;
        }
        default:
          break;
      }
    }
  }
}
