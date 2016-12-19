import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable()
export class LoginGuard implements CanActivate {

  constructor(
    private auth: AuthService, private router: Router) {}

  public canActivate(): Promise<boolean> {
    return this.auth.isLoggedIn().then(result => {
      if (result) {
        this.router.navigate(['']);
      }
      return !result;
    });
  }
}
