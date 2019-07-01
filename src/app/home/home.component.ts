import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { State, UserTagsActions } from '../root-store';
import { AuthService } from '../shared/services/auth.service';
import { WithUnsubscribe } from '../utils/mixins/with-unsubscribe';
import { Route } from '../core/nav-menu/models';
import { getCurrentRoute, getRoutes } from '../core/nav-menu/redux/nav-menu.reducers';
import * as authActions from '../reducers/auth/redux/auth.actions';

@Component({
  selector: 'cs-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends WithUnsubscribe() implements OnInit {
  public routes$: Observable<Route[]> = this.store.pipe(select(getRoutes));
  public currentRoute$: Observable<Route> = this.store.pipe(select(getCurrentRoute));
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
      });
  }
}
