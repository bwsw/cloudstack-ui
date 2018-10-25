import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { RouterUtilsService } from './router-utils.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private routerUtilsService: RouterUtilsService,
  ) {}

  public canActivate(_, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.isLoggedIn().pipe(
      map(result => {
        if (!result) {
          this.router.navigate(
            ['/logout'],
            this.routerUtilsService.getRedirectionQueryParams(state.url),
          );
        }
        return result;
      }),
    );
  }
}
