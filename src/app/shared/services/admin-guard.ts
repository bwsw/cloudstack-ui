import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from './auth.service';
import { RouterUtilsService } from './router-utils.service';


@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private routerUtilsService: RouterUtilsService
  ) { }

  public canActivate(_, state: RouterStateSnapshot): boolean {
    if (this.auth.isAdmin()) {
      return true;
    } else {
      this.router.navigate(['../accounts']);
    }
    return false;
  }
}
