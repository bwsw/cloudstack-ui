import { Injectable } from '@angular/core';

import { AffinityGroup } from '../models';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { BaseBackendCachedService } from './base-backend-cached.service';


@Injectable()
@BackendResource({
  entity: 'AffinityGroup',
  entityModel: AffinityGroup
})
export class AffinityGroupService extends BaseBackendCachedService<AffinityGroup> {
  public removeEmptyGroups(): void {
    this.invalidateCache();
    this.getList()
      .subscribe(affinityGroupList => {
        affinityGroupList
          .filter(ag => !ag.virtualMachineIds.length)
          .forEach(ag => this.remove({ id: ag.id }).subscribe());
      });
  }
}
