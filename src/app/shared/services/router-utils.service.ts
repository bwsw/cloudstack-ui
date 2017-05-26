import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';


@Injectable()
export class RouterUtilsService {
  constructor(private router: Router) {}

  public get locationOrigin(): string {
    if (location.origin) {
      return location.origin;
    } else {
      return '' + location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    }
  }

  public getRedirectionQueryParams(next?: string): NavigationExtras {
    return {
      queryParams: {
        next: next || this.routeWithoutQueryParams
      }
    };
  }

  public get routeWithoutQueryParams(): string {
    return this.router.routerState.snapshot.url.split('?')[0];
  }
}
