import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared';
import { INotificationService } from '../shared/services/notification.service';
import { SecurityGroupService } from '../shared/services/security-group.service';

@Component({
  selector: 'cs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {

  private username: string;
  private password: string;
  private usernameRequired: boolean;
  private passwordRequired: boolean;

  constructor(
    private auth: AuthService,
    @Inject('INotificationService') private notification: INotificationService,
    private router: Router,
    private securityGroupService: SecurityGroupService
  ) {
    this.username = '';
    this.password = '';
    this.usernameRequired = false;
    this.passwordRequired = false;
  }

  public onSubmit(): void {
    this.login(this.username, this.password);
  }

  private login(username: string, password: string): void {
    this.auth.login(username, password)
      .then(() => this.handleLogin())
      .catch(error => this.handleError(error));
  }

  private handleLogin(): void {
    this.securityGroupService.removeEmptyGroups();
    this.router.navigate(['']);
  }

  private handleError(error: string): void {
    this.usernameRequired = !this.username;
    this.passwordRequired = !this.password;
    if (!this.usernameRequired && !this.passwordRequired) {
      this.notification.message(error);
    }
  }
}
