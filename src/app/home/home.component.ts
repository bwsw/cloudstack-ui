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

  constructor (private auth: AuthService, private router: Router) {
    this.title = this.auth.name;

    this.auth.authObservable.subscribe(event => {
      this.updateAccount(event);
    });
  }

  public logout(): void {
    this.auth.logout()
      .then(() => this.router.navigate(['/login']))
      .catch(error => alert(error));
  }

  private updateAccount(event: string): void {
    if (event === 'loggedIn') {
      this.title = this.auth.name;
    }
    if (event === 'loggedOut') {
      this.router.navigate(['/login']);
    }
  }
}
