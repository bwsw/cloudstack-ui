import { Component } from '@angular/core';
import { State } from '../../../reducers/index';
import { Store } from '@ngrx/store';
import * as fromAuth from '../../../reducers/auth/redux/auth.reducers';
import * as fromAccounts from '../../../reducers/accounts/redux/accounts.reducers';


@Component({
  selector: 'cs-vm-statistics-container',
  template: `
    <cs-vm-statistics
      *loading="loading$ | async"
      [accounts]="accounts$ | async"
      [user]="user$ | async"
    ></cs-vm-statistics>`
})
export class VmStatisticContainerComponent {

  readonly user$ = this.store.select(fromAuth.getUserAccount);
  readonly accounts$ = this.store.select(fromAccounts.selectDomainAccounts);
  readonly loading$ = this.store.select(fromAccounts.isLoading);

  constructor(
    private store: Store<State>,
  ) {
  }

}
