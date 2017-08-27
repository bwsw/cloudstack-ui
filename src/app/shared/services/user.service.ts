import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BackendResource } from '../decorators';
import { User } from '../models/user.model';
import { BaseBackendService } from './base-backend.service';


@Injectable()
@BackendResource({
  entity: 'User',
  entityModel: User
})
export class UserService extends BaseBackendService<User> {
  public updatePassword(id: string, password: string): Observable<any> {
    return this.postRequest('update', { id, password });
  }

  public registerKeys(id: string): Observable<any> {
    return this.sendCommand('register;Keys', { id }).map(res => res.userkeys);
  }
}
