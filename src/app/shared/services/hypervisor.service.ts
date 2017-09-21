import { Injectable } from '@angular/core';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { Hypervisor } from '../models/hypervisor.model';
import { BaseBackendCachedService } from './base-backend-cached.service';


@Injectable()
@BackendResource({
  entity: 'Hypervisor',
  entityModel: Hypervisor
})
export class HypervisorService extends BaseBackendCachedService<Hypervisor> {

  public getHypervisorList() {
    return this.getList();
  }
}
