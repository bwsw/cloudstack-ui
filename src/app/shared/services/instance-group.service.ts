import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackendResource } from '../decorators';
import { BaseBackendService } from './base-backend.service';
import { InstanceGroup } from '../models';

@Injectable()
@BackendResource({
  entity: 'InstanceGroup',
})
export class InstanceGroupService extends BaseBackendService<InstanceGroup> {
  constructor(protected http: HttpClient) {
    super(http);
  }
}
