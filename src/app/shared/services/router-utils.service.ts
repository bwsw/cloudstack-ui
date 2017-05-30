import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable()
export class RouterUtilsService {
  constructor(private router: Router) {}

  public getRouteWithoutQueryParams(): string {
    return this.router.routerState.snapshot.url.split('?')[0];
  }
}
