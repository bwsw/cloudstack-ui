import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Account } from '../../shared/models/account.model';
import { NotificationService } from '../../shared/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'cs-account-sidebar',
  templateUrl: 'account-sidebar.component.html'
})
export class AccountSidebarComponent {
  @Input() public entity: any;
  @Output() public onAccountChanged = new EventEmitter<Account>();

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
