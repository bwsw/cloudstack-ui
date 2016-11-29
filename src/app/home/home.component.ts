import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

import { AuthService } from '../shared/auth.service';


@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  private title: string;
  private loggedIn: boolean;

  constructor (private auth: AuthService, private router: Router, private http: Http) {
    this.title = this.auth.getName();
    this.loggedIn = this.auth.isLoggedIn();

    this.auth.loginObservable.subscribe(() => {
      this.updateAccount();
    });
    this.auth.logoutObservable.subscribe(() => {
      this.updateAccount();
    });
  }

  private updateAccount(): void {
    this.title = this.auth.getName();
    this.loggedIn = this.auth.isLoggedIn();
  }

  private logout(): void {
    this.auth.logout()
      .then(() => this.handleLogout())
      .catch(error => alert(error));
  }

  private handleLogout(): void {
    this.router.navigate(['/login']);
  }

}
