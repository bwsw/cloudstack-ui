import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { BackendResource } from '../decorators';
import { BaseModelStub } from '../models';
import { AccountType } from '../models/account.model';
import { User } from '../models/user.model';
import { AsyncJobService } from './async-job.service';
import { BaseBackendService, CSCommands } from './base-backend.service';
import { LocalStorageService } from './local-storage.service';
import { Utils } from './utils/utils.service';
import { Store } from '@ngrx/store';
import { State } from '../../reducers/index';
import { JobsNotificationService } from './jobs-notification.service';

export interface Capabilities {
  allowusercreateprojects: boolean;
  allowuserexpungerecovervm: boolean;
  allowuserviewdestroyedvm: boolean;
  apilimitinterval: number,
  apilimitmax: number,
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
  entityModel: BaseModelStub
})
export class AuthService extends BaseBackendService<BaseModelStub> {
  public loggedIn: BehaviorSubject<boolean>;
  private _user: User | null;
  private capabilities: Capabilities | null;

  constructor(
    protected asyncJobService: AsyncJobService,
    protected storage: LocalStorageService,
    protected http: HttpClient,
    private store: Store<State>,
    protected jobsNotificationService: JobsNotificationService
  ) {
    super(http);
  }

  public initUser(): Promise<any> {
    try {
      const userRaw = this.storage.read('user');
      const user: User = Utils.parseJsonString(userRaw);
      this._user = user;
    } catch (e) {}

    this.loggedIn = new BehaviorSubject<boolean>(
      !!(this._user && this._user.userid)
    );
    this.jobsNotificationService.reset();

    return this._user && this._user.userid
      ? this.getCapabilities().toPromise()
      : Promise.resolve()
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
      .do((res) => this.saveUserDataToLocalStorage(res))
      .switchMap(() => this.getCapabilities())
      .do(() => this.loggedIn.next(true))
      .catch(error => this.handleCommandError(error.error));
  }

  public logout(): Observable<void> {
    return this.postRequest('logout')
      .do(() => this.setLoggedOut())
      .catch(error => Observable.throw('Unable to log out.'));
  }

  public isLoggedIn(): Observable<boolean> {
    return Observable.of(!!(this._user && this._user.userid));
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
    this._user = loginRes;
    this.storage.write('user', JSON.stringify(this._user));
  }

  private setLoggedOut(): void {
    this._user = null;
    this.storage.remove('user');
    this.loggedIn.next(false);
  }

  private getCapabilities(): Observable<void> {
    return this.sendCommand(CSCommands.ListCapabilities, {}, '')
      .map(({ capability }) => (this.capabilities = capability))
      .catch(() => this.logout());
  }
}
