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
  constructor(private auth: AuthService,
              private router: Router) {
  }

  public ngOnInit(): void {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
