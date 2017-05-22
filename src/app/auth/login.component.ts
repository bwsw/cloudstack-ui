import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  AuthService,
  INotificationService,
} from '../shared';


const fadeIn = 600;

@Component({
  selector: 'cs-login',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  public username: string;
  public password: string;
  public loading = true;

  constructor(
    private auth: AuthService,
    @Inject('INotificationService') private notification: INotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.username = '';
    this.password = '';
  }

  public ngOnInit(): void {
    setTimeout(() => this.loading = false, fadeIn);
  }

  public onSubmit(): void {
    this.login(this.username, this.password);
  }

  private login(username: string, password: string): void {
    this.auth.login(username, password)
      .subscribe(() => {
        this.handleLogin();
      }, error => {
        this.handleError(error);
      });
  }

  private handleLogin(): void {
    const next = this.route.snapshot.queryParams['next'] || '';
    this.router.navigateByUrl(next);
  }

  private handleError(error: string): void {
    this.notification.message(error);
  }
}
