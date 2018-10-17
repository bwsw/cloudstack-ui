import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';

@Injectable()
export class RouterUtilsService {
  constructor(private platformLocation: PlatformLocation, private router: Router) {}

  public getBaseHref(): string {
    return this.platformLocation.getBaseHrefFromDOM();
  }

  public getLocationOrigin(): string {
    if (location.origin) {
      return location.origin;
    }
    const port = location.port ? `:${location.port}` : '';
    return `${location.protocol}//${location.hostname}${port}`;
  }

  public getRedirectionQueryParams(next?: string): NavigationExtras {
    return {
      queryParams: {
        next: next || this.getRouteWithoutQueryParams(),
      },
    };
  }

  public getRouteWithoutQueryParams(): string {
    return this.router.routerState.snapshot.url.split('?')[0];
  }
}
