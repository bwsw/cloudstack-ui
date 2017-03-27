import { Injectable } from '@angular/core';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';


@Injectable()
@BackendResource({
  entity: 'User',
  entityModel: User
})
export class UserService extends BaseBackendService<User> {
  public updatePassword(id: string, password: string): Observable<any> {
    return this.postRequest('update', { id, password });
  }
}
