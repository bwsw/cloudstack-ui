import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  debounceTime,
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { BackendResource } from '../decorators';
import { BaseModel } from '../models';
import { AccountType } from '../models/account.model';
import { User } from '../models/user.model';
import { AsyncJobService } from './async-job.service';
import { BaseBackendService } from './base-backend.service';
import { LocalStorageService } from './local-storage.service';
import { Utils } from './utils/utils.service';
import {
  capabilitiesActions,
  capabilitiesSelectors,
} from '../../root-store/server-data/capabilities';
import { State } from '../../reducers';
import { configSelectors } from '../../root-store/config';
import * as accountActions from '../../reducers/accounts/redux/accounts.actions';
import * as accountSelectors from '../../reducers/accounts/redux/accounts.reducers';
import { AccountUser } from '../models/account-user.model';

@Injectable()
@BackendResource({
  entity: '',
})
export class AuthService extends BaseBackendService<BaseModel> {
  public loggedIn = new BehaviorSubject<boolean>(false);
  public user$: Observable<User>;
  private userSubject = new BehaviorSubject<User>(null);

  constructor(
    protected asyncJobService: AsyncJobService,
    protected storage: LocalStorageService,
    protected store: Store<State>,
    protected http: HttpClient,
  ) {
    super(http);
    this.user$ = this.userSubject.asObservable();
  }

  public initUser() {
    try {
      const userRaw = this.storage.read('user');
      const user: User = Utils.parseJsonString(userRaw);
      this.userSubject.next(user);
    } catch (e) {}

    this.loggedIn.next(!!(this.user && this.user.userid));
  }

  public get user(): User {
    return this.userSubject.value;
  }

  public generateKey(): Observable<void> {
    return this.store.pipe(
      select(configSelectors.get('autoGenerateUserKeys')),
      debounceTime(2000),
      withLatestFrom(this.store.pipe(select(accountSelectors.selectUserAccount))),
      map(([isAutoGenerateUserKeys, userAccount]) => {
        const userRaw: User = Utils.parseJsonString(this.storage.read('user'));
        const user: AccountUser = userAccount.user.find(u => u.id === userRaw.userid);
        if (isAutoGenerateUserKeys && user && !user.secretkey && !user.apikey) {
          this.store.dispatch(new accountActions.AccountUserGenerateKey(user));
        }
      }),
    );
  }

  public login(username: string, password: string, domain?: string): Observable<void> {
    return this.postRequest('login', { username, password, domain }).pipe(
      map(res => this.getResponse(res)),
      tap(res => this.saveUserDataToLocalStorage(res)),
      tap(() => this.store.dispatch(new capabilitiesActions.LoadCapabilities())),
      switchMap(() => {
        return this.store.pipe(
          select(capabilitiesSelectors.isLoading),
          filter(isLoading => !isLoading),
        );
      }),
      tap(() => this.loggedIn.next(true)),
      catchError(error => this.handleCommandError(error.error)),
    );
  }

  public logout(): Observable<void> {
    return this.postRequest('logout').pipe(
      tap(() => this.setLoggedOut()),
      catchError(() => throwError('Unable to log out.')),
    );
  }

  public isLoggedIn(): Observable<boolean> {
    return of(!!(this.user && this.user.userid));
  }

  public isAdmin(): boolean {
    return !!this.user && this.user.type !== AccountType.User;
  }

  private saveUserDataToLocalStorage(loginRes: User): void {
    this.userSubject.next(loginRes);
    this.storage.write('user', JSON.stringify(this.user));
  }

  private setLoggedOut(): void {
    this.userSubject.next(null);
    this.storage.remove('user');
    this.storage.remove('userAccount');
    this.loggedIn.next(false);
  }
}
