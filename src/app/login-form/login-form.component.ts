import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared/auth.service';
import { AlertService } from '../shared/alert.service';

@Component({
  selector: 'my-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.scss'],
})
export class LoginFormComponent {

  private username: string;
  private password: string;

  constructor(private auth: AuthService,
              private alert: AlertService,
              private router: Router) {
    this.username = '';
    this.password = '';
  }

  private login(username: string, password: string): void {
    this.auth.login(username, password)
      .then(() => this.handleLogin())
      .catch(error => this.handleError(error));
  }

  private handleLogin(): void {
    this.router.navigate(['/']);
  }

  private handleError(error: string): void {
    this.alert.alert(error);
  }

  private submit(): void {
    this.login(this.username, this.password);
  }
}
