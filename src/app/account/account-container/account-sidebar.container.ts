import {
  Component,
  OnInit
} from '@angular/core';
import { State } from '../../reducers/index';
import { Store } from '@ngrx/store';
import * as accountEvent from '../../reducers/accounts/redux/accounts.actions';
import { ActivatedRoute } from '@angular/router';
import * as fromAccounts from '../../reducers/accounts/redux/accounts.reducers';
import { WithUnsubscribe } from '../../utils/mixins/with-unsubscribe';

@Component({
  selector: 'cs-account-page-container',
  template: `
    <cs-account-sidebar
      [entity]="account$ | async"
      (onAccountChanged)="onAccountChange($event)"
    ></cs-account-sidebar>`
})
export class AccountSidebarContainerComponent extends WithUnsubscribe() implements OnInit {

  readonly account$ = this.store.select(fromAccounts.getSelectedAccount);
  readonly loading$ = this.store.select(fromAccounts.isLoading);


  constructor(
    private store: Store<State>,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  public onAccountChange(id) {
    this.store.dispatch(new accountEvent.LoadAccountsRequest());
  }

  public ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.store.dispatch(new accountEvent.LoadSelectedAccount(params['id']));

  }

}
