import { Injectable } from '@angular/core';
import { BaseBackendCachedService } from './base-backend-cached.service';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { ResourceCount } from '../models/resource-count.model';
import { CSCommands } from './base-backend.service';


@Injectable()
@BackendResource({
  entity: 'ResourceCount'
})
export class ResourceCountService extends BaseBackendCachedService<ResourceCount> {
  constructor(protected http: HttpClient) {
    super(http);
  }

  public updateResourceCount(
    params: { [key: string]: string; }
  ): Observable<Array<ResourceCount>> {
    return this.sendCommand(CSCommands.Update, params).map(response => this.formatGetListResponse(response).list);
  }
}
