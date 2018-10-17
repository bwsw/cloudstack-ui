import { Component } from '@angular/core';
import { DialogService } from '../../dialog/dialog-service/dialog.service';
import { select, Store } from '@ngrx/store';
import { State } from '../../reducers/index';

import * as accountActions from '../../reducers/accounts/redux/accounts.actions';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import * as fromDomains from '../../reducers/domains/redux/domains.reducers';
import * as fromRoles from '../../reducers/roles/redux/roles.reducers';
import { AccountData } from '../../shared/models/account.model';

@Component({
  selector: 'cs-account-creation-container',
  template: `
    <cs-account-creation-dialog
      [isLoading]="loading$ | async"
      [domains]="domains$ | async"
      [roles]="roles$ | async"
      (accountCreated)="createAccount($event)"
    >
    </cs-account-creation-dialog>`,
})
export class AccountCreationContainerComponent {
  public loading$ = this.store.pipe(select(fromAccounts.isLoading));
  public domains$ = this.store.pipe(select(fromDomains.selectAll));
  public roles$ = this.store.pipe(select(fromRoles.selectAll));

  constructor(public dialogService: DialogService, private store: Store<State>) {}

  public createAccount(data: AccountData) {
    this.store.dispatch(new accountActions.CreateAccount(data));
  }
}
