import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { State, UserTagsActions } from '../root-store';
import { AuthService } from '../shared/services/auth.service';
import { LayoutService } from '../shared/services/layout.service';
import { WithUnsubscribe } from '../utils/mixins/with-unsubscribe';
import { getName } from '../shared/models';
import * as authActions from '../reducers/auth/redux/auth.actions';
import * as serviceOfferingActions from '../reducers/service-offerings/redux/service-offerings.actions';

@Component({
  selector: 'cs-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends WithUnsubscribe() implements OnInit {
  public disableSecurityGroups = false;

  constructor(
    private auth: AuthService,
    private layoutService: LayoutService,
    private store: Store<State>
  ) {
    super();
  }

  public ngOnInit(): void {
    this.store.dispatch(new UserTagsActions.LoadUserTags());

    this.auth.loggedIn
      .takeUntil(this.unsubscribe$)
      .filter(isLoggedIn => !!isLoggedIn)
      .subscribe(() => {
        this.store.dispatch(new serviceOfferingActions.LoadCompatibilityPolicyRequest());
        this.store.dispatch(new authActions.LoadUserAccountRequest({
          name: this.auth.user.account,
          domainid: this.auth.user.domainid
        }));
        this.disableSecurityGroups = this.auth.isSecurityGroupEnabled();
      });
  }

  public get title(): string {
    return this.auth.user ? getName(this.auth.user) : '';
  }

  public get isDrawerOpen(): boolean {
    return this.layoutService.drawerOpen;
  }
}
