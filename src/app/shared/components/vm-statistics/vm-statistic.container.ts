import { Component } from '@angular/core';
import { State } from '../../../reducers';
import { select, Store } from '@ngrx/store';
import * as fromAccounts from '../../../reducers/accounts/redux/accounts.reducers';

@Component({
  selector: 'cs-vm-statistics-container',
  template: `
    <cs-vm-statistics
      [fetching]="loading$ | async"
      [accounts]="accounts$ | async"
      [user]="user$ | async"
    ></cs-vm-statistics>`,
})
export class VmStatisticContainerComponent {
  readonly user$ = this.store.pipe(select(fromAccounts.selectUserAccount));
  readonly accounts$ = this.store.pipe(select(fromAccounts.selectDomainAccounts));
  readonly loading$ = this.store.pipe(select(fromAccounts.isLoading));

  constructor(private store: Store<State>) {}
}
