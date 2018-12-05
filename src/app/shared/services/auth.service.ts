import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { BackendResource } from '../decorators';
import { BaseModel } from '../models';
import { AccountType } from '../models/account.model';
import { User } from '../models/user.model';
import { AsyncJobService } from './async-job.service';
import { BaseBackendService } from './base-backend.service';
import { LocalStorageService } from './local-storage.service';
import { Utils } from './utils/utils.service';
import { JobsNotificationService } from './jobs-notification.service';
import { select, Store } from '@ngrx/store';
import { State } from '../../root-store';
import * as fromCapabilities from '../../reducers/capabilities/redux/capabilities.reducers';
import * as capabilityActions from '../../reducers/capabilities/redux/capabilities.actions';

@Injectable()
@BackendResource({
  entity: '',
})
export class AuthService extends BaseBackendService<BaseModel> {
  public loggedIn: BehaviorSubject<boolean>;
  // tslint:disable-next-line:variable-name
  private _user: User | null;

  constructor(
    protected asyncJobService: AsyncJobService,
    protected storage: LocalStorageService,
    protected store: Store<State>,
    protected http: HttpClient,
    protected jobsNotificationService: JobsNotificationService,
  ) {
    super(http);
  }

  public initUser(): Promise<any> {
    try {
      const userRaw = this.storage.read('user');
      const user: User = Utils.parseJsonString(userRaw);
      this._user = user;
    } catch (e) {}

    this.loggedIn = new BehaviorSubject<boolean>(!!(this._user && this._user.userid));
    this.jobsNotificationService.reset();

    if (!this._user || !this._user.userid) {
      return Promise.resolve();
    }

    debugger;

    this.store.dispatch(new capabilityActions.LoadCapabilitiesRequest());
    return this.store
      .pipe(
        select(fromCapabilities.getCapabilities),
        filter(Boolean),
      )
      .toPromise();
  }

  public get user(): User | null {
    return this._user;
  }

  public login(username: string, password: string, domain?: string): Observable<void> {
    return this.postRequest('login', { username, password, domain }).pipe(
      map(res => this.getResponse(res)),
      tap(res => this.saveUserDataToLocalStorage(res)),
      map(() => {
        debugger;
        return this.store.dispatch(new capabilityActions.LoadCapabilitiesRequest());
      }),
      switchMap(() => {
        return this.store.pipe(
          select(fromCapabilities.getCapabilities),
          filter(Boolean),
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
    return of(!!(this._user && this._user.userid));
  }

  public isAdmin(): boolean {
    return !!this.user && this.user.type !== AccountType.User;
  }

  private saveUserDataToLocalStorage(loginRes: User): void {
    this._user = loginRes;
    this.storage.write('user', JSON.stringify(this._user));
  }

  private setLoggedOut(): void {
    this._user = null;
    this.storage.remove('user');
    this.loggedIn.next(false);
  }
}
