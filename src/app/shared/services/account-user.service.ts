import { Injectable } from '@angular/core';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { BaseBackendService } from './base-backend.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AccountUser } from '../models/account-user.model';

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

  public createUser(user: AccountUser): Observable<{ user: AccountUser }> {
    return this.sendCommand('create', user);
  }

  public updateUser(user: AccountUser): Observable<{ user: AccountUser }> {
    return this.sendCommand('update', user);
  }

  public removeUser(user: AccountUser): Observable<any> {
    return this.sendCommand('delete', {
      id: user.id,
    });
  }

  public generateKeys(user: AccountUser): Observable<{ userkeys: object }> {
    return this.sendCommand('register', {
      id: user.id
    }, 'UserKeys');
  }
}
