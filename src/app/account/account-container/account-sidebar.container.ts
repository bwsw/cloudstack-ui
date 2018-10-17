import { Component, OnInit } from '@angular/core';
import { State } from '../../reducers/index';
import { select, Store } from '@ngrx/store';
import * as accountEvent from '../../reducers/accounts/redux/accounts.actions';
import { ActivatedRoute } from '@angular/router';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';

@Component({
  selector: 'cs-account-page-container',
  template: `
    <cs-account-sidebar
      [entity]="account$ | async"
    ></cs-account-sidebar>`,
})
export class AccountSidebarContainerComponent implements OnInit {
  readonly account$ = this.store.pipe(select(fromAccounts.getSelectedAccount));

  constructor(private store: Store<State>, private activatedRoute: ActivatedRoute) {}

  public ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.store.dispatch(new accountEvent.LoadSelectedAccount(params['id']));
  }
}
