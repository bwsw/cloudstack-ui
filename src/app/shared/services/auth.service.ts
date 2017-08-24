import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { BackendResource } from '../decorators';
import { BaseModelStub } from '../models';
import { User } from '../models/user.model';
import { AsyncJobService } from './async-job.service';
import { BaseBackendService } from './base-backend.service';
import { ConfigService } from './config.service';
import { LocalStorageService } from './local-storage.service';
import { RouterUtilsService } from './router-utils.service';
import { UserTagService } from './tags/user-tag.service';
import { UserService } from './user.service';


const DEFAULT_SESSION_REFRESH_INTERVAL = 60;

@Injectable()
@BackendResource({
  entity: '',
  entityModel: BaseModelStub
})
export class AuthService extends BaseBackendService<BaseModelStub> {
  public loggedIn: BehaviorSubject<boolean>;
  private refreshTimer: any;
  private numberOfRefreshes = 0;
  private inactivityTimeout: number;
  private sessionRefreshInterval = DEFAULT_SESSION_REFRESH_INTERVAL;

  private _user: User | null;

  constructor(
    protected asyncJobService: AsyncJobService,
    protected configService: ConfigService,
    protected storage: LocalStorageService,
    protected router: Router,
    protected userService: UserService,
    protected userTagService: UserTagService,
    protected routerUtilsService: RouterUtilsService,
    protected zone: NgZone
  ) {
    super();
    this.loggedIn = new BehaviorSubject<boolean>(!!(this._user && this._user.userId));
  }

  public startInactivityCounter() {
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
        if (Number.isNaN(timeout)) {
          return this.userTagService.setSessionTimeout(0);
        }

        return Observable.of(timeout);
      });
  }

  public get user(): User | null {
    return this._user;
  }

  public login(
    username: string,
    password: string,
    domain?: string
  ): Observable<void> {
    return this.postRequest('login', { username, password, domain })
      .map(res => this.getResponse(res))
      .do(res => this.setLoggedIn(res))
      .catch(error => this.handleCommandError(error));
  }

  public logout(): Observable<void> {
    const obs = new Subject<void>();
    this.postRequest('logout')
      .do(() => this.setLoggedOut())
      .catch(error => {
        this.error.send(error);
        return Observable.throw('Unable to log out.');
      })
      .subscribe(() => obs.next());
    return obs;
  }

  public isLoggedIn(): Observable<boolean> {
    return Observable.of(!!(this._user && this._user.userId));
  }

  public sendRefreshRequest(): void {
    this.userService.getList().subscribe();
  }

  private setLoggedIn(loginRes): void {
    this._user = new User(loginRes);
    this.loggedIn.next(true);
  }

  private setLoggedOut(): void {
    this._user = null;
    this.loggedIn.next(false);
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
}
