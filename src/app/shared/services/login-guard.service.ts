import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  public canActivate(): Observable<boolean> {
    return this.auth.isLoggedIn().pipe(
      map(result => {
        if (result) {
          this.router.navigate(['/instances']);
        }
        return !result;
      }),
    );
  }
}
