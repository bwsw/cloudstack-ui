import { Injectable } from '@angular/core';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators';
import { User } from '../models/user.model';
import { Observable } from 'rxjs/Observable';
import { StorageService } from './storage.service';
import { TagService } from './tag.service';
import { ResourceTypes } from '../models';


@Injectable()
@BackendResource({
  entity: 'User',
  entityModel: User
})
export class UserService extends BaseBackendService<User> {
  constructor(
    private storageService: StorageService,
    private tagService: TagService
  ) {
    super();
  }

  public updatePassword(id: string, password: string): Observable<any> {
    return this.postRequest('update', { id, password });
  }

  public writeTag(key: string, value: string): Observable<void> {
    const user = { id: this.storageService.read('userId') };
    if (!user.id) {
      return Observable.of(null);
    }
    return this.tagService.update(user, 'User', key, value);
  }

  public readTag(key: string): Observable<string> {
    const user = { id: this.storageService.read('userId') };
    if (!user.id) {
      return Observable.of(null);
    }
    return this.tagService.getTag(user, key).map(tag => tag ? tag.value : undefined);
  }

  public removeTag(key: string): Observable<void> {
    let userId = this.storageService.read('userId');
    if (!userId) {
      return;
    }
    return this.tagService.remove({
      resourceIds: userId,
      resourceType: ResourceTypes.USER,
      'tags[0].key': key
    });
  }
}
