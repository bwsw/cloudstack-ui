import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  public canActivate(): Observable<boolean> {
    return this.auth.isLoggedIn().map(result => {
      if (result) {
        this.router.navigate(['/instances']);
      }
      return !result;
    });
  }
}
