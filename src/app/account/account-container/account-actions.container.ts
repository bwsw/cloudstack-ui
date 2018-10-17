import { Component, Input } from '@angular/core';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';

import * as accountActions from '../../reducers/accounts/redux/accounts.actions';
import { Account } from '../../shared/models/account.model';

@Component({
  selector: 'cs-account-action-container',
  template: `
    <cs-account-actions
      [account]="account"
      (accountDeleted)="onAccountDelete($event)"
      (accountDisabled)="onAccountDisable($event)"
      (accountEnabled)="onAccountEnable($event)"
    >
    </cs-account-actions>`,
})
export class AccountActionsContainerComponent {
  @Input()
  public account: Account;

  constructor(public dialogService: DialogService, private store: Store<State>) {}

  public onAccountEnable(account: Account): void {
    this.store.dispatch(new accountActions.EnableAccountRequest(account));
  }

  public onAccountDisable(account: Account): void {
    this.store.dispatch(new accountActions.DisableAccountRequest(account));
  }

  public onAccountDelete(account: Account): void {
    this.store.dispatch(new accountActions.DeleteAccountRequest(account));
  }
}
