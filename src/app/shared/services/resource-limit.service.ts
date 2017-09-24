import { Injectable } from '@angular/core';
import { BaseBackendCachedService } from './base-backend-cached.service';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { ResourceLimit } from '../models/resource-limit.model';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';


@Injectable()
@BackendResource({
  entity: 'ResourceLimit',
  entityModel: ResourceLimit
})
export class ResourceLimitService extends BaseBackendCachedService<ResourceLimit> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public getList(params?: {}): Observable<Array<ResourceLimit>> {
    return super.getList(params)
      .map(result => result.sort((a, b) => a.resourceType - b.resourceType));
  }
}
