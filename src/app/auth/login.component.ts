import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared';
import { INotificationService } from '../shared/services/notification.service';

@Component({
  selector: 'cs-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent {
  private username: string;
  private password: string;

  constructor(
    private auth: AuthService,
    @Inject('INotificationService') private notification: INotificationService,
    private router: Router
  ) {
    this.username = '';
    this.password = '';
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
    this.router.navigate(['']);
  }

  private handleError(error: string): void {
    this.notification.message(error);
  }
}
