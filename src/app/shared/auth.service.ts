import { Inject, Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ApiRequestBuilderService } from '../shared/api-request-builder.service';
import { IStorageService } from '../shared/storage.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';

const apiUrl = '/client/api';

interface LoginResponse {
  loginresponse: {
    firstname: string,
    lastname: string
  };
}

@Injectable()
export class AuthService {

  public loginObservable: Subject<string>;
  public logoutObservable: Subject<string>;

  private _headers: Headers;

  constructor(private http: Http,
    @Inject('IStorageService') private storage: IStorageService,
    private requestBuilder: ApiRequestBuilderService) {
    this.loginObservable = new Subject<string>();
    this.logoutObservable = new Subject<string>();

    this._headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
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
    return this.http.post(apiUrl, this.getLoginRequest(username, password), { headers: this._headers })
      .toPromise()
      .then(response => this.setLoggedIn(response.json()))
      .catch(this.handleLoginError);
  }

  public logout(): Promise<void> {
    return this.http.get(this.getLogoutRequest())
      .toPromise()
      .then(response => this.setLoggedOut())
      .catch(this.handleLogoutError);
  }

  public isLoggedIn(): boolean {
    return <String>this.storage.read('loggedIn') === 'true';
  }


  private getLoginRequest(username: string, password: string): string {
    return this.requestBuilder.buildPOSTRequest({
      'command': 'login',
      'username': username,
      'password': password,
      'domain': '/',
      'response': 'json'
    });
  }

  private getLogoutRequest(): string {
    return this.requestBuilder.buildGETRequest({
      'command': 'logout',
      'response': 'json'
    });
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
