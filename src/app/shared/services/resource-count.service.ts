import { Injectable } from '@angular/core';
import { BaseBackendCachedService } from './base-backend-cached.service';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { ResourceCount } from '../models/resource-count.model';


@Injectable()
@BackendResource({
  entity: 'ResourceCount',
  entityModel: ResourceCount
})
export class ResourceCountService extends BaseBackendCachedService<ResourceCount> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public updateResourceCount(
    params: { [key: string]: string; }
  ): Observable<Array<ResourceCount>> {
    return this.sendCommand('update', params).map(response => this.formatGetListResponse(response).list);
  }
}
