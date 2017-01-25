import { Component } from '@angular/core';

import { AuthService } from '../shared/services';
import { Router } from '@angular/router';


@Component({
  selector: 'cs-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.scss'],
})
export class LogoutComponent {
  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  public logout(): void {
    this.auth.logout()
      .subscribe(() => {
        this.router.navigate(['/login']);
      });
  }
}
