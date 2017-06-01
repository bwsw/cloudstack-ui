import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { BaseBackendService } from './base-backend.service';
import { BaseModelStub } from '../models';
import { BackendResource } from '../decorators';
import { ConfigService } from './config.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';

import debounce = require('lodash/debounce');


const DEFAULT_SESSION_REFRESH_INTERVAL = 60;

@Injectable()
@BackendResource({
  entity: '',
  entityModel: BaseModelStub
})
export class AuthService extends BaseBackendService<BaseModelStub> {
  public loggedIn: BehaviorSubject<string>;
  private refreshTimer: any;
  private numberOfRefreshes = 0;
  private inactivityTimeout: number;
  private sessionRefreshInterval = DEFAULT_SESSION_REFRESH_INTERVAL;

  constructor(
    protected configService: ConfigService,
    protected storage: StorageService,
    protected userService: UserService,
    protected zone: NgZone
  ) {
    super();

    this.loggedIn = new BehaviorSubject<string>(!!this.userId ? 'login' : 'logout');

    debounce(this.refreshSession, 1000, { leading: true });
    debounce(this.resetTimer, 1000, { leading: true });

    Observable.forkJoin(
      this.getInactivityTimeout(),
      this.getSessionRefreshInterval()
    )
      .subscribe(([inactivityTimeout, sessionRefreshInterval]) => {
        this.inactivityTimeout = inactivityTimeout;
        this.sessionRefreshInterval = sessionRefreshInterval;
        this.resetTimer();
        this.addEventListeners();
      });
  }

  public setInactivityTimeout(value: number): Observable<void> {
    return this.userService.writeTag('sessionTimeout', value.toString())
      .map(() => {
        this.inactivityTimeout = value;
        this.resetTimer();
      });
  }

  public getInactivityTimeout(): Observable<number> {
    if (this.inactivityTimeout) {
      return Observable.of(this.inactivityTimeout);
    }

    return this.userService.readTag('sessionTimeout')
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
    return this.storage.read('name') || '';
  }

  public get username(): string {
    return this.storage.read('username') || '';
  }

  public get userId(): string {
    return this.storage.read('userId') || '';
  }

  public set name(name: string) {
    if (!name) {
      this.storage.remove('name');
    } else {
      this.storage.write('name', name);
    }
  }

  public set username(username: string) {
    if (!username) {
      this.storage.remove('username');
    } else {
      this.storage.write('username', username);
    }
  }

  public set userId(userId: string) {
    if (!userId) {
      this.storage.remove('userId');
    } else {
      this.storage.write('userId', userId);
    }
  }

  public login(username: string, password: string, domain?: string): Observable<void> {
    return this.postRequest('login', { username, password, domain })
      .map(res => this.getResponse(res))
      .map(res => {
        this.setLoggedIn(res.username, `${res.firstname} ${res.lastname}`, res.userid);
        return res;
      })
      .catch((error) => this.handleCommandError(error));
  }

  public logout(): Observable<void> {
    return this.postRequest('logout')
      .map(() => this.setLoggedOut('logout'))
      .catch(error => {
        this.error.send(error);
        return Observable.throw('Unable to log out.');
      });
  }

  public isLoggedIn(): Observable<boolean> {
    return Observable.of(!!this.userId);
  }

  public setLoggedIn(username: string, name: string, userId: string): void {
    this.name = name;
    this.username = username;
    this.userId = userId;
    this.loggedIn.next('login');
  }

  public setLoggedOut(a: string): void {
    this.name = '';
    this.username = '';
    this.userId = '';
    this.loggedIn.next(a);
  }

  public sendRefreshRequest(): void {
    this.userService.getList().subscribe();
  }

  private refreshSession(): void {
    if (++this.numberOfRefreshes * this.sessionRefreshInterval >= this.inactivityTimeout * 60) {
      this.clearTimer();
      this.zone.run(() => this.logout().subscribe());
    } else {
      this.sendRefreshRequest();
    }
  }

  private addEventListeners(): void {
    const events = 'mousemove keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll'.split(' ');
    const observables = events.map(event => Observable.fromEvent(document, event));
    this.zone.runOutsideAngular(() => {
      Observable.merge(...observables).subscribe(() => this.resetTimer());
    });
  }

  private resetTimer(): void {
    this.clearTimer();
    this.numberOfRefreshes = 0;
    if (this.inactivityTimeout) {
      this.setTimer();
    }
  }

  private clearTimer(): void {
    clearInterval(this.refreshTimer);
  }

  private setTimer(): void {
    if (this.sessionRefreshInterval && this.inactivityTimeout) {
      this.refreshTimer = setInterval(this.refreshSession.bind(this), this.sessionRefreshInterval * 1000);
    }
  }

  private getSessionRefreshInterval(): Observable<number> {
    return this.configService.get('sessionRefreshInterval')
      .map(refreshInterval => {
        if (Number.isInteger(refreshInterval) && refreshInterval > 0) {
          return refreshInterval;
        } else {
          return DEFAULT_SESSION_REFRESH_INTERVAL;
        }
      });
  }
}
