import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  AuthService,
} from '../shared';


@Component({
  selector: 'cs-logout',
  template: ''
})
export class LogoutComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.auth.logout().subscribe(() => {
      const next = this.auth.redirectUrl;
      const queryParams = { };
      if (next) {
        queryParams['next'] = next;
      }
      this.router.navigate(['/login'], { queryParams });
    });
  }
}
