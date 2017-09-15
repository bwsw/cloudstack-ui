import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { VirtualMachine } from '../../vm/shared/vm.model';
import { BackendResource } from '../decorators';

import { AffinityGroup } from '../models';
import { AffinityGroupType } from '../models/affinity-group.model';
import { AsyncJobService } from './async-job.service';
import { BaseBackendCachedService } from './base-backend-cached.service';
import { CacheService } from './cache.service';
import { ErrorService } from './error.service';


export interface AffinityGroupCreationData {
  name: string;
  type: AffinityGroupType;
  description?: string;
}

@Injectable()
@BackendResource({
  entity: 'AffinityGroup',
  entityModel: AffinityGroup
})
export class AffinityGroupService extends BaseBackendCachedService<AffinityGroup> {
  constructor(
    private asyncJob: AsyncJobService,
    http: HttpClient,
    error: ErrorService,
    cacheService: CacheService
  ) {
    super(http, error, cacheService);
  }

  public getTypes(params?: {}): Observable<Array<AffinityGroupType>> {
    return this.sendCommand('list;Types', params)
      .map(result => result[`affinityGroupType`] || []);
  }

  public create(params: AffinityGroupCreationData): Observable<AffinityGroup> {
    return super.create(params)
      .switchMap(job => this.asyncJob.queryJob(job.jobid, this.entity, this.entityModel));
  }

  public updateForVm(vm: VirtualMachine, affinityGroup?: AffinityGroup): Observable<VirtualMachine> {
    return this.sendCommand('updateVM', {
      id: vm.id,
      affinityGroupIds: affinityGroup && affinityGroup.id || ''
    })
      .switchMap(job => this.asyncJob.queryJob(job.jobid, 'virtualmachine', VirtualMachine));
  }

  public removeForVm(vm: VirtualMachine): Observable<VirtualMachine> {
    return this.updateForVm(vm);
  }
}
