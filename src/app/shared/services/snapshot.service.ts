import { Injectable } from '@angular/core';

import { Snapshot } from '../models/snapshot.model';
import { BaseBackendCachedService } from '.';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { AsyncJobService } from './async-job.service';
import { Observable } from 'rxjs';
import { AsyncJob } from '../models/async-job.model';


@Injectable()
@BackendResource({
  entity: 'Snapshot',
  entityModel: Snapshot
})
export class SnapshotService extends BaseBackendCachedService<Snapshot> {
  constructor(
    private asyncJobService: AsyncJobService
  ) {
    super();
  }

  public create(volumeId: string, name?: string): Observable<AsyncJob> {
    this.invalidateCache();
    let params = {};

    if (name) {
      params = { volumeId: volumeId, name };
    } else {
      params = { volumeId: volumeId };
    }

    return this.sendCommand('create', params)
      .switchMap(job => this.asyncJobService.addJob(job.jobid))
      .map(result => {
        if (result && result.jobResultCode === 0 && result.jobResult) {
          result.jobResult = new this.entityModel(result.jobResult.snapshot);
        }
        this.asyncJobService.event.next(result);
        return result;
      });
  }

  public remove(id: string): Observable<any> {
    return this.sendCommand('delete', { id })
      .switchMap(job => this.asyncJobService.addJob(job.jobid))
      .switchMap(jobResult => {
        if (jobResult.jobStatus === 2) {
          return Observable.throw(jobResult.jobResult.errortext);
        }
        return Observable.of(null);
      });
  }

  public getList(volumeId?: string): Observable<Array<Snapshot>> {
    if (volumeId) {
      return super.getList({ volumeId: volumeId });
    }
    return super.getList();
  }
}
