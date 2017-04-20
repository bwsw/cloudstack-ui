import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IStorageService } from './storage.service';
import { BaseBackendService } from './base-backend.service';
import { BaseModelStub } from '../models/base.model';
import { ErrorService } from './error.service';
import { BackendResource } from '../decorators/backend-resource.decorator';


@Injectable()
@BackendResource({
  entity: '',
  entityModel: BaseModelStub
})
export class AuthService extends BaseBackendService<BaseModelStub> {
  public loggedIn: BehaviorSubject<boolean>;

  constructor(
    @Inject('IStorageService') protected storage: IStorageService,
    protected error: ErrorService
  ) {
    super();
    this.loggedIn = new BehaviorSubject<boolean>(!!this.userId);
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
      .map(() => this.setLoggedOut())
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
    this.loggedIn.next(true);
  }

  public setLoggedOut(): void {
    this.name = '';
    this.username = '';
    this.userId = '';
    this.loggedIn.next(false);
  }
}
