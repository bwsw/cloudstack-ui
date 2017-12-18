import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { AccountUser, ApiKeys } from '../models/account-user.model';
import { BaseBackendService } from './base-backend.service';

@Injectable()
@BackendResource({
  entity: 'User'
})
export class AccountUserService extends BaseBackendService<AccountUser> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  protected prepareModel(res, entityModel?): AccountUser {
    if (entityModel) {
      return entityModel(res) as AccountUser;
    }
    return res as AccountUser;
  }

  public createUser(user: AccountUser): Observable<AccountUser> {
    return this.sendCommand('create', user)
      .map(res => res.user);
  }

  public updateUser(user: AccountUser): Observable<AccountUser> {
    return this.sendCommand('update', user)
      .map(res => res.user);
  }

  public removeUser(user: AccountUser): Observable<any> {
    return this.sendCommand('delete', {
      id: user.id,
    });
  }

  public generateKeys(user: AccountUser): Observable<ApiKeys> {
    return this.sendCommand('register;Keys', {
      id: user.id
    }).map(res => res.userkeys);
  }

  public getUserKeys(id: string): Observable<ApiKeys> {
    return this.sendCommand('get;Keys', { id }).map(res => res.userkeys);
  }
}
