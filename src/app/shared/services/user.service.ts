import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { BackendResource } from '../decorators';
import { User } from '../models/user.model';
import { BaseBackendService } from './base-backend.service';
import { CacheService } from './cache.service';
import { ConfigService } from './config.service';
import { ErrorService } from './error.service';
import { RouterUtilsService } from './router-utils.service';
import { UserTagService } from './tags/user-tag.service';

const DEFAULT_SESSION_REFRESH_INTERVAL = 60;
const DEFAULT_SESSION_TIMEOUT = 30;

@Injectable()
@BackendResource({
  entity: 'User',
  entityModel: User
})
export class UserService extends BaseBackendService<User> {
  private refreshTimer: any;
  private numberOfRefreshes = 0;
  private inactivityTimeout: number;
  private sessionRefreshInterval = DEFAULT_SESSION_REFRESH_INTERVAL;

  constructor(
    private userTagService: UserTagService,
    protected configService: ConfigService,
    protected router: Router,
    protected routerUtilsService: RouterUtilsService,
    protected zone: NgZone,
    http: HttpClient,
    error: ErrorService,
    cacheService: CacheService
  ) {
    super(http, error, cacheService);
  }

  public updatePassword(id: string, password: string): Observable<any> {
    return this.postRequest('update', { id, password });
  }

  public registerKeys(id: string): Observable<any> {
    return this.sendCommand('register;Keys', { id }).map(res => res.userkeys);
  }

  public startIdleMonitor() {
    const sessionRefreshInterval = this.getSessionRefreshInterval();

    this.getInactivityTimeout().subscribe(inactivityTimeout => {
      this.inactivityTimeout = inactivityTimeout;
      this.sessionRefreshInterval = sessionRefreshInterval;
      this.resetInactivityTimer();
      this.addEventListeners();
    });
  }

  public setInactivityTimeout(value: number): Observable<void> {
    return this.userTagService.setSessionTimeout( value)
      .map(() => {
        this.inactivityTimeout = value;
        this.resetInactivityTimer();
      });
  }

  public getInactivityTimeout(): Observable<number> {
    if (this.inactivityTimeout) {
      return Observable.of(this.inactivityTimeout);
    }

    return this.userTagService.getSessionTimeout()
      .switchMap(timeout => {
        if (Number.isNaN(timeout) || timeout < 0) {
          return Observable.of(this.getSessionTimeout());
        }

        return Observable.of(timeout);
      });
  }

  public sendRefreshRequest(): void {
    this.getList().subscribe();
  }

  private refreshSession(): void {
    if (
      ++this.numberOfRefreshes * this.sessionRefreshInterval >=
      this.inactivityTimeout * 60
    ) {
      this.clearInactivityTimer();
      this.zone.run(() =>
        this.router.navigate(
          ['/logout'],
          this.routerUtilsService.getRedirectionQueryParams()
        )
      );
    } else {
      this.sendRefreshRequest();
    }
  }

  private addEventListeners(): void {
    const events = 'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll'.split(' ');
    const observables = events.map(event => Observable.fromEvent(document, event));
    this.zone.runOutsideAngular(() => {
      Observable.merge(...observables).subscribe(() => this.resetInactivityTimer());
    });
  }

  private resetInactivityTimer(): void {
    this.clearInactivityTimer();
    this.numberOfRefreshes = 0;
    if (this.inactivityTimeout) {
      this.setInactivityTimer();
    }
  }

  public clearInactivityTimer(): void {
    clearInterval(this.refreshTimer);
  }

  public stopIdleMonitor(): void {
    this.clearInactivityTimer();
    this.inactivityTimeout = 0;
  }

  private setInactivityTimer(): void {
    if (this.sessionRefreshInterval && this.inactivityTimeout) {
      this.refreshTimer = setInterval(
        this.refreshSession.bind(this),
        this.sessionRefreshInterval * 1000
      );
    }
  }

  private getSessionRefreshInterval(): number {
    const refreshInterval = this.configService.get('sessionRefreshInterval');

    if (Number.isInteger(refreshInterval) && refreshInterval > 0) {
      return refreshInterval;
    }

    return DEFAULT_SESSION_REFRESH_INTERVAL;
  }

  private getSessionTimeout(): number {
    const sessionTimeout = this.configService.get('sessionTimeout');

    if (Number.isInteger(sessionTimeout) && sessionTimeout > 0) {
      return sessionTimeout;
    }

    return DEFAULT_SESSION_TIMEOUT;
  }
}
