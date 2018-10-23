import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseBackendCachedService } from './base-backend-cached.service';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { ResourceLimit } from '../models/resource-limit.model';
import { CSCommands } from './base-backend.service';

@Injectable()
@BackendResource({
  entity: 'ResourceLimit',
})
export class ResourceLimitService extends BaseBackendCachedService<ResourceLimit> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public updateResourceLimit(resourceLimit: ResourceLimit): Observable<ResourceLimit> {
    this.invalidateCache();
    return this.sendCommand(CSCommands.Update, {
      resourceType: resourceLimit.resourcetype,
      max: resourceLimit.max,
      domainid: resourceLimit.domainid,
      account: resourceLimit.account,
    });
  }
}
