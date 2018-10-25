import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseBackendCachedService } from './base-backend-cached.service';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { ResourceCount } from '../models/resource-count.model';
import { CSCommands } from './base-backend.service';

@Injectable()
@BackendResource({
  entity: 'ResourceCount',
})
export class ResourceCountService extends BaseBackendCachedService<ResourceCount> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public updateResourceCount(params: { [key: string]: string }): Observable<ResourceCount[]> {
    return this.sendCommand(CSCommands.Update, params).pipe(
      map(response => this.formatGetListResponse(response).list),
    );
  }
}
