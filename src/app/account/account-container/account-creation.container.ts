import { Component } from '@angular/core';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import { AccountData } from '../creation-form/account-creation-dialog.component';

import * as accountAction from '../../reducers/accounts/redux/accounts.actions';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import * as fromDomains from '../../reducers/domains/redux/domains.reducers';
import * as fromRoles from '../../reducers/roles/redux/roles.reducers';


@Component({
  selector: 'cs-account-creation-container',
  template: `
    <cs-account-creation-dialog
      [isLoading]="loading$ | async"
      [domains]="domains$ | async"
      [roles]="roles$ | async"
      (onAccountCreate)="createAccount($event)"
    >
    </cs-account-creation-dialog>`,
})
export class AccountCreationContainer {
  public loading$ = this.store.select(fromAccounts.isLoading);
  public domains$ = this.store.select(fromDomains.selectAll);
  public roles$ = this.store.select(fromRoles.selectAll);

  constructor(
    public dialogService: DialogService,
    private store: Store<State>,
  ) {
  }

  public createAccount(data: AccountData) {
    this.store.dispatch(new accountAction.CreateAccount(data));
  }
}
