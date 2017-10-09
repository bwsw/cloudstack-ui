import { Component, OnInit } from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import * as accountEvent from '../redux/accounts.actions';
import { ActivatedRoute } from '@angular/router';
import * as fromAccounts from '../redux/accounts.reducers';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';

@Component({
  selector: 'cs-account-page-container',
  template: `
    <cs-account-sidebar
      [entity]="account$ | async"
      (onAccountChanged)="onAccountChange($event)"
    ></cs-account-sidebar>`
})
export class AccountSidebarContainer extends WithUnsubscribe() implements OnInit {

  readonly account$ = this.store.select(fromAccounts.selectedAccount);


  constructor(
    private store: Store<State>,
    private activatedRoute: ActivatedRoute,
  ) {
    super();
  }

  public onAccountChange(account) {
    this.store.dispatch(new accountEvent.LoadAccountsRequest({}));
  }

  public ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.store.dispatch(new accountEvent.LoadSelectedAccountRequest(params['id']));

  }

}
