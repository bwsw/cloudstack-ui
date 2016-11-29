import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ApiRequestBuilderService } from '../shared/api-request-builder.service';
import { StorageService } from '../shared/storage.service';
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

  constructor(private http: Http, private storage: StorageService, private requestBuilder: ApiRequestBuilderService) {
    this.loginObservable = new Subject<string>();
    this.logoutObservable = new Subject<string>();

    this._headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
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

  public getName(): string {
    let name = this.storage.read('name');
    if (!name) {
      return 'Unauthorized';
    }
    return name;
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
    this.setName(response.loginresponse.firstname, response.loginresponse.lastname);
    this.loginObservable.next('');
  }

  private setLoggedOut(): void {
    this.storage.write('loggedIn', 'false');
    this.removeName();
    this.logoutObservable.next('');
  }

  private setName(firstName: String, lastName: String): void {
    this.storage.write('name', `${firstName} ${lastName}`);
  }

  private removeName(): void {
    this.storage.remove('name');
  }
}
