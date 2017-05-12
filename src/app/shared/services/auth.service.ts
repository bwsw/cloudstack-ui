import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { BaseBackendService } from './base-backend.service';
import { BaseModelStub } from '../models';
import { BackendResource } from '../decorators';
import { StorageService } from './storage.service';
import { UserService } from './user.service';

import debounce = require('lodash/debounce');

export const SESSION_REFRESH_INTERVAL = 1000;


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

  constructor(
    protected storage: StorageService,
    protected userService: UserService,
    protected zone: NgZone
  ) {
    super();

    this.loggedIn = new BehaviorSubject<string>(!!this.userId ? 'login' : 'logout');

    debounce(this.refreshSession, SESSION_REFRESH_INTERVAL, { leading: true });
    debounce(this.resetTimer, SESSION_REFRESH_INTERVAL, { leading: true });

    this.getInactivityTimeout().subscribe();
    this.addEventListeners();
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
            .map(() => {
              this.inactivityTimeout = newTimeout;
              return newTimeout;
            });
        } else {
          this.inactivityTimeout = convertedTimeout;
          this.resetTimer();
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

  public login(username: string, password: string): Observable<void> {
    return this.postRequest('login', { username, password })
      .map(response => {
        let res = response.loginresponse;
        this.setLoggedIn(res.username, `${res.firstname} ${res.lastname}`, res.userid);
      })
      .catch(() => Observable.throw('Incorrect username or password.'));
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
    if (++this.numberOfRefreshes >= this.inactivityTimeout) {
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
    this.refreshTimer = setInterval(this.refreshSession.bind(this), SESSION_REFRESH_INTERVAL);
  }
}
