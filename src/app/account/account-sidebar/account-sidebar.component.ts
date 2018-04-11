import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account } from '../../shared/models';
import { NotificationService } from '../../shared/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { isHaveSameAccount } from '../../shared/utils/account';

@Component({
  selector: 'cs-account-sidebar',
  templateUrl: 'account-sidebar.component.html',
  styleUrls: ['account-sidebar.component.scss']
})
export class AccountSidebarComponent {
  @Input() public entity: Account;
  @Output() public onAccountChanged = new EventEmitter<Account>();

  public get isSelf() {
    return isHaveSameAccount(this.authService.user, this.entity);
  }

  constructor(
    protected notificationService: NotificationService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected authService: AuthService
  ) {
  }

  public tabIsActive(tabId: string) {
    const path = this.route.snapshot;
    const pathLastChild = path.firstChild.routeConfig.path;
    return (tabId === pathLastChild);
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }
}
