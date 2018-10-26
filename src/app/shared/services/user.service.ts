import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BackendResource } from '../decorators';
import { AccountUser, ApiKeys } from '../models/account-user.model';
import { BaseBackendService, CSCommands } from './base-backend.service';

@Injectable()
@BackendResource({
  entity: 'User',
})
export class UserService extends BaseBackendService<AccountUser> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public createUser(user: AccountUser): Observable<AccountUser> {
    return this.sendCommand(CSCommands.Create, user).pipe(map(res => res.user));
  }

  public updateUser(user: AccountUser): Observable<AccountUser> {
    return this.sendCommand(CSCommands.Update, user).pipe(map(res => res.user));
  }

  public removeUser(user: AccountUser): Observable<any> {
    return this.sendCommand(CSCommands.Delete, {
      id: user.id,
    });
  }

  public updatePassword(id: string, password: string): Observable<any> {
    return this.postRequest(CSCommands.Update, { id, password });
  }

  public registerKeys(id: string): Observable<ApiKeys> {
    return this.sendCommand(CSCommands.RegisterKeys, { id }).pipe(map(res => res.userkeys));
  }

  public getUserKeys(id: string): Observable<ApiKeys> {
    return this.sendCommand(CSCommands.GetKeys, { id }).pipe(map(res => res.userkeys));
  }

  protected prepareModel(res, entityModel?): AccountUser {
    if (entityModel) {
      return entityModel(res) as AccountUser;
    }
    return res as AccountUser;
  }
}
