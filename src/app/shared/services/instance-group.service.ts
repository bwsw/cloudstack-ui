import { Injectable } from '@angular/core';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { InstanceGroup } from '../models/instance-group.model';
import { BaseBackendService } from './base-backend.service';
import { Observable } from 'rxjs';

@Injectable()
@BackendResource({
  entity: 'InstanceGroup',
  entityModel: InstanceGroup
})
export class InstanceGroupService extends BaseBackendService<InstanceGroup> {
  public create(name: string): Observable<InstanceGroup> {
    return this.sendCommand('create', { name });
  }
}
