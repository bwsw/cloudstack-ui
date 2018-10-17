import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, takeUntil } from 'rxjs/operators';

import { configSelectors, layoutSelectors, State, UserTagsActions } from '../root-store';
import { AuthService } from '../shared/services/auth.service';
import { WithUnsubscribe } from '../utils/mixins/with-unsubscribe';
import { getName } from '../shared/models';
import * as authActions from '../reducers/auth/redux/auth.actions';

@Component({
  selector: 'cs-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends WithUnsubscribe() implements OnInit {
  public disableSecurityGroups = false;
  public isSidenavVisible$ = this.store.pipe(select(layoutSelectors.isSidenavVisible));
  public allowReorderingSidenav$ = this.store.pipe(
    select(configSelectors.get('allowReorderingSidenav'))
  );

  constructor(private auth: AuthService, private store: Store<State>) {
    super();
  }

  public ngOnInit(): void {
    this.store.dispatch(new UserTagsActions.LoadUserTags());

    this.auth.loggedIn.pipe(
      takeUntil(this.unsubscribe$),
      filter(isLoggedIn => isLoggedIn))
      .subscribe(() => {
        this.store.dispatch(
          new authActions.LoadUserAccountRequest({
            name: this.auth.user.account,
            domainid: this.auth.user.domainid,
          })
        );
        this.disableSecurityGroups = this.auth.isSecurityGroupEnabled();
      });
  }

  public get title(): string {
    return this.auth.user ? getName(this.auth.user) : '';
  }
}
