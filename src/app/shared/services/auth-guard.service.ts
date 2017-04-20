import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  public canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.isLoggedIn().map(result => {
      if (!result) {
        const next = state.url;
        const queryParams = { };
        if (next) {
          queryParams['next'] = next;
        }
        this.auth.logout().subscribe(() => this.router.navigate(['/login'], { queryParams }));
      }
      return result;
    });
  }
}
