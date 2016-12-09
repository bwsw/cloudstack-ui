import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IStorageService } from './storage.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import { BaseBackendService, BACKEND_API_URL } from './base-backend.service';
import { BaseModel } from '../models/base.model';
import { ErrorService } from './error.service';
import { BackendResource } from '../decorators/backend-resource.decorator';


interface LoginResponse {
  loginresponse: {
    firstname: string,
    lastname: string
  };
}

class AuthStub extends BaseModel { }

@Injectable()
@BackendResource({
  entity: '',
  entityModel: AuthStub
})
export class AuthService extends BaseBackendService<AuthStub> {

  public authObservable: Subject<string>;

    constructor(
      protected http: Http,
      @Inject('IStorageService') protected storage: IStorageService,
      protected error: ErrorService
    ) {
      super(http, error);
      this.authObservable = new Subject<string>();
  }

  get name(): string {
    let name = this.storage.read('name');
    return name ? name : '';
  }

  set name(name: string) {
    if (!name) {
      this.storage.remove('name');
    } else {
      this.storage.write('name', name);
    }
  }

  public login(username: string, password: string): Promise<void> {
    return this.postRequest('login', { username, password })
      .then(res => { this.setLoggedIn(res); })
      .catch(() => Promise.reject('Incorrect username or password.'));
  }

  public logout(): Promise<void> {
    return this.postRequest('logout')
      .then(response => this.setLoggedOut())
      .catch(() => Promise.reject('Unable to log out.'));
  }

  public isLoggedIn(): Promise<boolean> {
    if (this.name) {
      return this.http.get(BACKEND_API_URL)
        .toPromise()
        .then(response => true)
        .catch(e => {
          if (e.status === 400) {
            return Promise.resolve(true);
          } else {
            return Promise.resolve(false);
          }
        });
    } else {
      this.setLoggedOut();
      return Promise.resolve(false);
    }
  }

  private setLoggedIn(response: LoginResponse): void {
    this.name = `${response.loginresponse.firstname} ${response.loginresponse.lastname}`;
    this.authObservable.next('loggedIn');
  }

  private setLoggedOut(): void {
    this.name = '';
    this.authObservable.next('loggedOut');
  }
}
