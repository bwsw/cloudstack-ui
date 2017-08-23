import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BackendResource } from '../decorators';
import { BaseModelStub } from '../models';
import { AsyncJobService } from './async-job.service';

import { BaseBackendService } from './base-backend.service';
import { ConfigService } from './config.service';
import { RouterUtilsService } from './router-utils.service';
import { LocalStorageService } from './local-storage.service';
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

  constructor(
    protected asyncJobService: AsyncJobService,
    protected configService: ConfigService,
    protected storage: LocalStorageService,
    protected router: Router,
    protected userService: UserService,
    protected routerUtilsService: RouterUtilsService,
    protected zone: NgZone
  ) {
    super();
    this.loggedIn = new BehaviorSubject<boolean>(!!this.userId);
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
    return this.userService
      .writeTag('csui.user.session-timeout', value.toString())
      .map(() => {
        this.inactivityTimeout = value;
        this.resetInactivityTimer();
      });
  }

  public getInactivityTimeout(): Observable<number> {
    if (this.inactivityTimeout) {
      return Observable.of(this.inactivityTimeout);
    }

    return this.userService
      .readTag('csui.user.session-timeout')
      .switchMap(timeout => {
        const convertedTimeout = +timeout;

        if (Number.isNaN(convertedTimeout)) {
          const newTimeout = 0;
          return this.userService
            .writeTag('sessionTimeout', newTimeout.toString())
            .map(() => newTimeout);
        } else {
          return Observable.of(convertedTimeout);
        }
      });
  }

  public get name(): string {
    return this.getKeyFromStorage('name');
  }

  public get username(): string {
    return this.getKeyFromStorage('username');
  }

  public get userId(): string {
    return this.getKeyFromStorage('userId');
  }

  public get account(): string {
    return this.getKeyFromStorage('account');
  }

  public set account(account: string) {
    this.setKeyInStorage('account', account);
  }

  public set name(name: string) {
    this.setKeyInStorage('name', name);
  }

  public set username(username: string) {
    this.setKeyInStorage('username', username);
  }

  public set userId(userId: string) {
    this.setKeyInStorage('userId', userId);
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
    return Observable.of(!!this.userId);
  }

  public sendRefreshRequest(): void {
    this.userService.getList().subscribe();
  }

  private setLoggedIn(loginRes): void {
    const { username, userid, account, firstname, lastname } = loginRes;
    this.name = `${firstname} ${lastname}`;
    this.account = account;
    this.username = username;
    this.userId = userid;
    this.loggedIn.next(true);
  }

  private setLoggedOut(): void {
    this.name = '';
    this.username = '';
    this.userId = '';
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

  private getKeyFromStorage(key: string): string {
    return this.storage.read(key) || '';
  }

  private setKeyInStorage(key: string, value: any): void {
    if (!value) {
      this.storage.remove(key);
    } else {
      this.storage.write(key, value);
    }
  }
}
