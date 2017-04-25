import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
    private ar: ActivatedRoute,
    private router: Router
  ) {
  }

  public ngOnInit(): void {
    this.auth.logout().subscribe(() => {
      if (this.router.url !== '/login' && this.ar.snapshot.queryParams['loggedIn'] === 'reset') {
        this.router.navigate(['/login']).then(() => location.reload());
        return;
      }
      if (this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
    });
  }
}
