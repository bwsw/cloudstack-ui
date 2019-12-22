import { Component, HostListener, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { State, UserTagsActions } from '../root-store';
import { AuthService } from '../shared/services/auth.service';
import { WithUnsubscribe } from '../utils/mixins/with-unsubscribe';
import { Route } from '../core/nav-menu/models';
import {
  getCurrentRoute,
  getCurrentSubroute,
  getRoutes,
} from '../core/nav-menu/redux/nav-menu.reducers';
import * as authActions from '../reducers/auth/redux/auth.actions';
import { NavbarService } from '../core/services/navbar.service';
import * as fromAccounts from '../reducers/accounts/redux/accounts.reducers';
import { Account } from '../shared/models';
const debounce = require('lodash/debounce');

@Component({
  selector: 'cs-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent extends WithUnsubscribe() implements OnInit {
  public routes$: Observable<Route[]> = this.store.pipe(select(getRoutes));
  public currentRoute$: Observable<Route> = this.store.pipe(select(getCurrentRoute));
  public currentSubroute$: Observable<Route> = this.store.pipe(select(getCurrentSubroute));
  public account$: Observable<Account> = this.store.pipe(select(fromAccounts.selectUserAccount));
  public sideNavOpen = true;
  public sideNavMode = window.innerWidth > 900 ? 'side' : 'over';

  constructor(
    private auth: AuthService,
    private store: Store<State>,
    private navbar: NavbarService,
  ) {
    super();

    // initial the navbar menu button's action
    this.navbar.setDefaultButtonEvent(this.onMenuClick.bind(this));

    this.onResize = debounce(this.onResize.bind(this), 100);
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

    // When router changes and sideNavMode is 'over', hide the sideNav.
    this.currentSubroute$.subscribe(() => {
      if (this.sideNavMode === 'over' && this.sideNavOpen) {
        this.sideNavOpen = false;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event) {
    if (event.target.innerWidth > 900) {
      if (this.sideNavMode !== 'side') {
        this.sideNavOpen = true;
      }
      this.sideNavMode = 'side';
    } else {
      if (this.sideNavMode !== 'over') {
        this.sideNavOpen = false;
      }
      this.sideNavMode = 'over';
    }
  }

  public onMenuClick() {
    this.sideNavOpen = !this.sideNavOpen;
  }
}
