import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { IStorageService } from './storage.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import { BaseBackendService } from './base-backend.service';
import { BaseModel } from '../models/base.model';
import { INotificationService } from '../notification.service';
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

  public loginObservable: Subject<string>;
  public logoutObservable: Subject<string>;

    constructor(
    http: Http,
    @Inject('INotificationService') protected notification: INotificationService,
    @Inject('IStorageService') private storage: IStorageService,
  ) {
    super(http, notification);
    this.loginObservable = new Subject<string>();
    this.logoutObservable = new Subject<string>();
  }

  get name(): string {
    let name = this.storage.read('name');
    if (!name) {
      return 'Unauthorized';
    }
    return name;
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
      .then(res => this.setLoggedIn(res))
      .catch(this.handleLoginError);
  }

  public logout(): Promise<void> {
    return this.postRequest('logout')
      .then(response => this.setLoggedOut())
      .catch(this.handleLogoutError);
  }

  public isLoggedIn(): boolean {
    return <String>this.storage.read('loggedIn') === 'true';
  }

  private handleLoginError(): Promise<void> {
    return Promise.reject('Incorrect username or password.');
  }

  private handleLogoutError(): Promise<void> {
    return Promise.reject('Unable to log out');
  }

  private setLoggedIn(response: LoginResponse): void {
    this.storage.write('loggedIn', 'true');
    this.name = `${response.loginresponse.firstname} ${response.loginresponse.lastname}`;
    this.loginObservable.next('');
  }

  private setLoggedOut(): void {
    this.storage.write('loggedIn', 'false');
    this.name = '';
    this.logoutObservable.next('');
  }
}
