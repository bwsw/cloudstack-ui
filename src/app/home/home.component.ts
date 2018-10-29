import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { State, UserTagsActions, layoutStore } from '../root-store';
import { AuthService } from '../shared/services/auth.service';
import { WithUnsubscribe } from '../utils/mixins/with-unsubscribe';
import { Route, Subroute } from '../core/nav-menu/models';
import * as authActions from '../reducers/auth/redux/auth.actions';
import { getCurrentRoute, getRoutes, getSubroutes } from '../core/nav-menu/redux/nav-menu.reducers';

@Component({
  selector: 'cs-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends WithUnsubscribe() implements OnInit {
  public disableSecurityGroups = false;
  public routes$: Observable<Route[]> = this.store.pipe(select(getRoutes));
  public currentRoute$: Observable<Route> = this.store.pipe(select(getCurrentRoute));
  public subroutes$: Observable<Subroute[]> = this.store.pipe(select(getSubroutes));
  public showAppNav$: Observable<boolean> = this.store.pipe(
    select(layoutStore.selectors.getShowAppNav),
  );
  public username: string;

  constructor(private auth: AuthService, private store: Store<State>) {
    super();
    this.username = this.auth.user ? this.auth.user.username : '';
  }

  public ngOnInit(): void {
    this.store.dispatch(new UserTagsActions.LoadUserTags());

    this.auth.loggedIn
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(isLoggedIn => isLoggedIn),
      )
      .subscribe(() => {
        this.store.dispatch(
          new authActions.LoadUserAccountRequest({
            name: this.auth.user.account,
            domainid: this.auth.user.domainid,
          }),
        );
        this.disableSecurityGroups = this.auth.isSecurityGroupEnabled();
      });
  }

  public openAppNav() {
    this.store.dispatch(new layoutStore.actions.OpenAppNav());
  }

  public closeAppNav() {
    this.store.dispatch(new layoutStore.actions.CloseAppNav());
  }
}
