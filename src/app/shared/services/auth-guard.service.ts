import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService, private router: Router) {}

  public canActivate(): boolean {
    return true;
  }
}
