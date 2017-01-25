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
    let name = this.storage.read('name');
    return name ? name : '';
  }

  public set name(name: string) {
    if (!name) {
      this.storage.remove('name');
    } else {
      this.storage.write('name', name);
    }
  }

  public login(username: string, password: string): Observable<void> {
    return this.postRequest('login', { username, password })
      .map(response => {
        this.setLoggedIn(`${response.loginresponse.firstname} ${response.loginresponse.lastname}`);
      })
      .catch(() => Observable.throw('Incorrect username or password.'));
  }

  public logout(): Observable<void> {
    return this.postRequest('logout')
      .map(response => this.setLoggedOut())
      .catch(() => Observable.throw('Unable to log out.'));
  }

  public isLoggedIn(): Observable<boolean> {
    if (this.name) {
      return this.http.get(BACKEND_API_URL)
        .map(response => true)
        .catch(e => {
          if (e.status === 400) {
            return Observable.of(true);
          } else {
            this.setLoggedOut();
            return Observable.of(false);
          }
        });
    } else {
      return Observable.of(false);
    }
  }

  private setLoggedIn(name: string): void {
    this.name = name;
    this.loggedIn.next(true);
  }

  private setLoggedOut(): void {
    this.name = '';
    this.loggedIn.next(false);
  }
}
