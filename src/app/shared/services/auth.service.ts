import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { BackendResource } from '../decorators';
import { BaseModel } from '../models';
import { AccountType } from '../models/account.model';
import { User } from '../models/user.model';
import { AsyncJobService } from './async-job.service';
import { BaseBackendService, CSCommands } from './base-backend.service';
import { LocalStorageService } from './local-storage.service';
import { Utils } from './utils/utils.service';

export interface Capabilities {
  allowusercreateprojects: boolean;
  allowuserexpungerecovervm: boolean;
  allowuserviewdestroyedvm: boolean;
  apilimitinterval: number;
  apilimitmax: number;
  cloudstackversion: string;
  customdiskofferingmaxsize: number;
  customdiskofferingminsize: number;
  dynamicrolesenabled: boolean;
  kvmsnapshotenabled: boolean;
  projectinviterequired: boolean;
  regionsecondaryenabled: boolean;
  securitygroupsenabled: boolean;
  supportELB: string; // boolean string
  userpublictemplateenabled: boolean;
}

@Injectable()
@BackendResource({
  entity: '',
})
export class AuthService extends BaseBackendService<BaseModel> {
  public loggedIn = new BehaviorSubject<boolean>(false);
  public user$: Observable<User>;
  private userSubject = new BehaviorSubject<User>(null);
  private capabilities: Capabilities | null;

  constructor(
    protected asyncJobService: AsyncJobService,
    protected storage: LocalStorageService,
    protected http: HttpClient,
  ) {
    super(http);
    this.user$ = this.userSubject.asObservable();
  }

  public initUser(): Promise<any> {
    try {
      const userRaw = this.storage.read('user');
      const user: User = Utils.parseJsonString(userRaw);
      this.userSubject.next(user);
    } catch (e) {}

    this.loggedIn.next(!!(this.user && this.user.userid));

    return this.user && this.user.userid ? this.getCapabilities().toPromise() : Promise.resolve();
  }

  public get user(): User {
    return this.userSubject.value;
  }

  public login(username: string, password: string, domain?: string): Observable<void> {
    return this.postRequest('login', { username, password, domain }).pipe(
      map(res => this.getResponse(res)),
      tap(res => this.saveUserDataToLocalStorage(res)),
      switchMap(() => this.getCapabilities()),
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

  public allowedToViewDestroyedVms(): boolean {
    return !!this.capabilities && this.capabilities.allowuserviewdestroyedvm;
  }

  public canExpungeOrRecoverVm(): boolean {
    return !!this.capabilities && this.capabilities.allowuserexpungerecovervm;
  }

  public isSecurityGroupEnabled(): boolean {
    return !!this.capabilities && this.capabilities.securitygroupsenabled;
  }

  public getCustomDiskOfferingMinSize(): number | null {
    return this.capabilities && this.capabilities.customdiskofferingminsize;
  }

  public getCustomDiskOfferingMaxSize(): number | null {
    return this.capabilities && this.capabilities.customdiskofferingmaxsize;
  }

  private saveUserDataToLocalStorage(loginRes: User): void {
    this.userSubject.next(loginRes);
    this.storage.write('user', JSON.stringify(this.user));
  }

  private setLoggedOut(): void {
    this.userSubject.next(null);
    this.storage.remove('user');
    this.loggedIn.next(false);
  }

  private getCapabilities(): Observable<void> {
    return this.sendCommand(CSCommands.ListCapabilities, {}, '').pipe(
      map(({ capability }) => (this.capabilities = capability)),
      catchError(() => this.logout()),
    );
  }
}
