import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { Hypervisor } from '../models/hypervisor.model';
import { BaseBackendCachedService } from './base-backend-cached.service';

@Injectable()
@BackendResource({
  entity: 'Hypervisor',
})
export class HypervisorService extends BaseBackendCachedService<Hypervisor> {
  constructor(protected http: HttpClient) {
    super(http);
  }
}
