import { Injectable } from '@angular/core';

import { Snapshot } from '../models/snapshot.model';
import { BaseBackendService } from './base-backend.service';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { AsyncJobService } from './async-job.service';
import { Observable } from 'rxjs';
import { AsyncJob } from '../models/async-job.model';


@Injectable()
@BackendResource({
  entity: 'Snapshot',
  entityModel: Snapshot
})
export class SnapshotService extends BaseBackendService<Snapshot> {
  constructor(
    private asyncJobService: AsyncJobService
  ) {
    super();
  }

  public createSnapshot(volumeId: string, name?: string): Observable<string> {
    let params = {};

    if (name) {
      params = { volumeid: volumeId, name };
    } else {
      params = { volumeid: volumeId };
    }

    return this.createAsync(params)
      .map(result => result.createsnapshotresponse.jobid);
  }

  public checkSnapshot(jobId: string): Observable<AsyncJob> {
    return this.asyncJobService.addJob(jobId)
      .map(result => {
        if (result && result.jobResultCode === 0 && result.jobResult) {
          result.jobResult = new this.entityModel(result.jobResult.snapshot);
        }
        this.asyncJobService.event.next(result);
        return result;
      });
  }

  public getList(volumeId?: string): Observable<Array<Snapshot>> {
    if (volumeId) {
      return super.getList({ volumeid: volumeId });
    }
    return super.getList();
  }
}
