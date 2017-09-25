import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../shared/services/auth.service';
import { LayoutService } from '../shared/services/layout.service';

@Component({
  selector: 'cs-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public disableSecurityGroups = false;
  private loginSubscription: Subscription;

  constructor(private auth: AuthService, private layoutService: LayoutService) {}

  public ngOnInit(): void {
    this.loginSubscription = this.auth.loggedIn
      .filter(isLoggedIn => !!isLoggedIn)
      .subscribe(() => {
        this.disableSecurityGroups = this.auth.isSecurityGroupEnabled();
      });
  }

  public ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }

  public get title(): string {
    return this.auth.user ? this.auth.user.name : '';
  }

  public get isDrawerOpen(): boolean {
    return this.layoutService.drawerOpen;
  }
}
