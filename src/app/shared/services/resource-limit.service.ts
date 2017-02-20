import { Injectable } from '@angular/core';
import { BaseBackendCachedService } from '.';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { ResourceLimit } from '../models/resource-limit.model';
import { Observable } from 'rxjs/Rx';


@Injectable()
@BackendResource({
  entity: 'ResourceLimit',
  entityModel: ResourceLimit
})
export class ResourceLimitService extends BaseBackendCachedService<ResourceLimit> {
  public getList(params?: {}): Observable<Array<ResourceLimit>> {
    return super.getList(params)
      .map(result => result.sort((a, b) => a.resourceType - b.resourceType));
  }
}
