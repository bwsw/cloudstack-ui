import { Component, EventEmitter, Input, Output } from '@angular/core';
import { filter, onErrorResumeNext } from 'rxjs/operators';

import { AccountActionsService } from './account-actions.service';
import { Account } from '../../models/account.model';
import { DialogService } from '../../../dialog/dialog-service/dialog.service';

@Component({
  selector: 'cs-account-actions',
  template: `
    <ng-container *ngFor="let action of actions">
      <button
        *ngIf="action.canActivate(account)"
        mat-menu-item (click)="activateAction(action, account)"
      >
        <mat-icon [ngClass]="action.icon"></mat-icon>
        <span>{{ action.name | translate }}</span>
      </button>
    </ng-container>`,
})
export class AccountActionsComponent {
  @Input()
  public account: Account;
  @Output()
  public accountEnabled: EventEmitter<Account> = new EventEmitter<Account>();
  @Output()
  public accountDisabled: EventEmitter<Account> = new EventEmitter<Account>();
  @Output()
  public accountDeleted: EventEmitter<Account> = new EventEmitter<Account>();

  public actions: any[];

  constructor(
    private accountActionsService: AccountActionsService,
    private dialogService: DialogService,
  ) {
    this.actions = this.accountActionsService.actions;
  }

  public activateAction(action, account: Account) {
    this.dialogService
      .confirm({ message: action.confirmMessage })
      .pipe(
        onErrorResumeNext(),
        filter(Boolean),
      )
      .subscribe(() => {
        switch (action.command) {
          case 'enable': {
            this.accountEnabled.emit(account);
            break;
          }
          case 'disable': {
            this.accountDisabled.emit(account);
            break;
          }
          case 'delete': {
            this.accountDeleted.emit(account);
            break;
          }
          default:
            break;
        }
      });
  }
}
