import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../shared/services';

@Component({
  selector: 'cs-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  private title: string;
  private loggedIn: boolean;

  constructor (
    private auth: AuthService,
    private router: Router
  ) {
    this.title = this.auth.name;
    this.loggedIn = this.auth.isLoggedIn();

    this.auth.loginObservable.subscribe(() => {
      this.updateAccount();
    });
    this.auth.logoutObservable.subscribe(() => {
      this.updateAccount();
    });
  }

  public logout(): void {
    this.auth.logout()
      .then(() => this.handleLogout())
      .catch(error => alert(error));
  }

  private updateAccount(): void {
    this.title = this.auth.name;
    this.loggedIn = this.auth.isLoggedIn();
  }

  private handleLogout(): void {
    this.router.navigate(['/login']);
  }
}
