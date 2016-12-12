import { Component } from '@angular/core';

import { AuthService } from '../shared/services';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { ErrorService } from '../shared/services/error.service';


@Component({
  selector: 'cs-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.scss'],
})
export class LogoutComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService,
    private error: ErrorService
  ) {
    // Do something with api
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  public logout(): void {
    this.auth.logout()
      .then(() => this.router.navigate(['/login']))
      .catch(error => this.error.next(error));
  }
}
