import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { BackendResource } from '../decorators';
import { BaseModelStub } from '../models';
import { AccountType } from '../models/account.model';
import { User } from '../models/user.model';
import { AsyncJobService } from './async-job.service';
import { BaseBackendService } from './base-backend.service';
import { CacheService } from './cache.service';
import { LocalStorageService } from './local-storage.service';
import { Utils } from './utils/utils.service';

export interface Capabilities {
  securitygroupsenabled: boolean;
  dynamicrolesenabled: boolean;
  cloudstackversion: string;
  userpublictemplateenabled: boolean;
  supportELB: string; // boolean string
  projectinviterequired: boolean;
  allowusercreateprojects: boolean;
  customdiskofferingminsize: number;
  customdiskofferingmaxsize: number;
  regionsecondaryenabled: boolean;
  kvmsnapshotenabled: boolean;
  allowuserviewdestroyedvm: boolean;
  allowuserexpungerecovervm: boolean;
}

@Injectable()
@BackendResource({
  entity: '',
  entityModel: BaseModelStub
})
export class AuthService extends BaseBackendService<BaseModelStub> {
  public loggedIn: BehaviorSubject<boolean>;
  private _user: User | null;
  private capabilities: Capabilities | null;

  constructor(
    protected asyncJobService: AsyncJobService,
    protected storage: LocalStorageService,
    http: HttpClient,
    cacheService: CacheService
  ) {
    super(http, error, cacheService);
  }

  public initUser(): Promise<any> {
    try {
      const userRaw = this.storage.read('user');
      const user = Utils.parseJsonString(userRaw);
      this._user = new User(user);
    } catch (e) {}

    this.loggedIn = new BehaviorSubject<boolean>(
      !!(this._user && this._user.userId)
    );

    return this._user.userId
      ? this.getCapabilities().toPromise()
      : Promise.resolve();
  }

  public get user(): User | null {
    return this._user;
  }

  public login(
    username: string,
    password: string,
    domain?: string
  ): Observable<void> {
    return this.postRequest('login', { username, password, domain })
      .map(res => this.getResponse(res))
      .switchMap(res => this.getCapabilities().do(() => this.setLoggedIn(res)))
      .catch(error => this.handleCommandError(error));
  }

  public logout(): Observable<void> {
    return this.postRequest('logout')
      .do(() => this.setLoggedOut())
      .catch(error => {
        return Observable.throw('Unable to log out.');
      });
  }

  public isLoggedIn(): Observable<boolean> {
    return Observable.of(!!(this._user && this._user.userId));
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

  private setLoggedIn(loginRes): void {
    this._user = new User(loginRes);
    this.storage.write('user', JSON.stringify(this._user.serialize()));
    this.loggedIn.next(true);
  }

  private setLoggedOut(): void {
    this._user = null;
    this.storage.remove('user');
    this.loggedIn.next(false);
  }

  private getCapabilities(): Observable<void> {
    return this.sendCommand('listCapabilities', {}, '')
      .map(({ capability }) => (this.capabilities = capability))
      .catch(() => this.logout());
  }
}
