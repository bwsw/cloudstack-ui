import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';
import { Utils } from './utils.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  public canActivate(_, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.isLoggedIn().map(result => {
      if (!result) {
        this.router.navigate(
          ['/logout'],
          Utils.getRedirectionQueryParams(state.url, this.router.routerState)
        );
      }
      return result;
    });
  }
}
