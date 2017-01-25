import { Component } from '@angular/core';

import { AuthService } from '../shared/services';
import { Router } from '@angular/router';
import { ErrorService } from '../shared/services/error.service';
import { Observable } from 'rxjs/Rx';


@Component({
  selector: 'cs-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.scss'],
})
export class LogoutComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private error: ErrorService
  ) { }

  public logout(): void {
    this.auth.logout()
      .subscribe(() => {
        this.router.navigate(['/login']);
      }, error => {
        this.error.send(error);
      });
  }
}
