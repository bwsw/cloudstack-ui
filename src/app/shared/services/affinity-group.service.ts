import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { VirtualMachine } from '../../vm/shared/vm.model';
import { BackendResource } from '../decorators';
import { AffinityGroup, AsyncJob } from '../models';
import { AffinityGroupType } from '../models/affinity-group.model';
import { AsyncJobService } from './async-job.service';
import { BaseBackendCachedService } from './base-backend-cached.service';
import { CSCommands } from './base-backend.service';


export interface AffinityGroupCreationData {
  name: string;
  type: AffinityGroupType;
  description?: string;
}

@Injectable()
@BackendResource({
  entity: 'AffinityGroup'
})
export class AffinityGroupService extends BaseBackendCachedService<AffinityGroup> {
  constructor(
    private asyncJob: AsyncJobService,
    protected http: HttpClient
  ) {
    super(http);
  }

  public create(params: AffinityGroupCreationData): Observable<AffinityGroup> {
    return super.create(params).pipe(
      switchMap(job => this.asyncJob.queryJob(job.jobid, this.entity, this.entityModel)),
      map((job: AsyncJob<any>) => job.jobresult.affinitygroup));
  }

  public updateForVm(
    vmId: string,
    affinityGroupIds: string
  ): Observable<VirtualMachine> {
    return this.sendCommand(CSCommands.UpdateVM, {
      id: vmId,
      affinitygroupids: affinityGroupIds
    }).pipe(
      switchMap(job => this.asyncJob.queryJob(job.jobid, 'virtualmachine', VirtualMachine)));
  }

}
