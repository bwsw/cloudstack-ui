import { Inject, Injectable } from '@angular/core';
import { IStorageService } from './storage.service';
import { BaseBackendService, BACKEND_API_URL } from './base-backend.service';
import { BaseModel } from '../models/base.model';
import { ErrorService } from './error.service';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { Observable, Subject } from 'rxjs/Rx';


class AuthStub extends BaseModel { }

@Injectable()
@BackendResource({
  entity: '',
  entityModel: AuthStub
})
export class AuthService extends BaseBackendService<AuthStub> {
  public loggedIn: Subject<boolean>;

  constructor(
    @Inject('IStorageService') protected storage: IStorageService,
    protected error: ErrorService
  ) {
    super();
    this.loggedIn = new Subject<boolean>();
  }

  public get name(): string {
    return this.storage.read('name') || '';
  }

  public get username(): string {
    return this.storage.read('username') || '';
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

  public login(username: string, password: string): Observable<void> {
    return this.postRequest('login', { username, password })
      .map(response => {
        let res = response.loginresponse;
        this.setLoggedIn(res.username, `${res.firstname} ${res.lastname}`);
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

  public checkLoggedIn(): void {
    if (!this.name) {
      this.loggedIn.next(false);
      return;
    }

    this.http.get(BACKEND_API_URL)
      .subscribe(
        () => {},
        e => {
          if (e.status === 400) {
            this.loggedIn.next(true);
          } else {
            this.setLoggedOut();
            this.loggedIn.next(false);
          }
        }
      );
  }

  public setLoggedIn(username: string, name: string): void {
    this.name = name;
    this.username = username;
    this.loggedIn.next(true);
  }

  public setLoggedOut(): void {
    this.name = '';
    this.username = '';
    this.loggedIn.next(false);
  }
}
