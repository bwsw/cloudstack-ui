import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { LayoutService } from '../shared/services/layout.service';
import { WithUnsubscribe } from '../utils/mixins/with-unsubscribe';

@Component({
  selector: 'cs-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends WithUnsubscribe() implements OnInit {
  public disableSecurityGroups = false;

  constructor(
    private auth: AuthService,
    private layoutService: LayoutService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.auth.loggedIn
      .takeUntil(this.unsubscribe$)
      .filter(isLoggedIn => !!isLoggedIn)
      .subscribe(() => {
        this.disableSecurityGroups = this.auth.isSecurityGroupEnabled();
      });
  }

  public get title(): string {
    return this.auth.user ? this.auth.user.name : '';
  }

  public get isDrawerOpen(): boolean {
    return this.layoutService.drawerOpen;
  }
}
