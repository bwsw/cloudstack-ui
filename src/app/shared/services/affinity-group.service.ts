import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AffinityGroup } from '../models';

import { BackendResource } from '../decorators/backend-resource.decorator';
import { BaseBackendCachedService } from './base-backend-cached.service';
import { AsyncJobService } from './async-job.service';


export interface AffinityGroupCreationData {
  name: string;
  type: string;
  description?: string;
}

@Injectable()
@BackendResource({
  entity: 'AffinityGroup',
  entityModel: AffinityGroup
})
export class AffinityGroupService extends BaseBackendCachedService<AffinityGroup> {
  constructor(private asyncJob: AsyncJobService) {
    super();
  }

  public getTypes(params?: {}) {
    return this.sendCommand('list;Types', params)
      .map(result => result[`affinityGroupType`] || []);
  }

  public create(params: AffinityGroupCreationData): Observable<AffinityGroup> {
    return super.create(params)
      .switchMap(job => this.asyncJob.queryJob(job, this.entity, this.entityModel));
  }
}
