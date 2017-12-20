import { Injectable } from '@angular/core';
import { BaseBackendCachedService } from './base-backend-cached.service';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { ResourceLimit } from '../models/resource-limit.model';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/account.model';


@Injectable()
@BackendResource({
  entity: 'ResourceLimit',
  entityModel: ResourceLimit
})
export class ResourceLimitService extends BaseBackendCachedService<ResourceLimit> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public updateResourceLimit(
    resourceLimit: ResourceLimit,
    account: Account
  ): Observable<ResourceLimit> {
    return this.sendCommand('update', {
      resourceType: resourceLimit.resourcetype,
      max: resourceLimit.max,
      domainid: account.domainid,
      account: account.name
    });
  }
}
