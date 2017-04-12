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
  constructor(private asyncJobService: AsyncJobService) {
    super();
  }

  public create(volumeId: string, name?: string): Observable<AsyncJob<Snapshot>> {
    this.invalidateCache();
    let params = {};

    if (name) {
      params = { volumeId: volumeId, name };
    } else {
      params = { volumeId: volumeId };
    }

    return this.sendCommand('create', params)
      .switchMap(job => this.asyncJobService.queryJob(job, this.entity, this.entityModel));
  }

  public remove(id: string): Observable<any> {
    this.invalidateCache();
    return this.sendCommand('delete', { id })
      .switchMap(job => this.asyncJobService.queryJob(job.jobid));
  }

  public getList(volumeId?: string): Observable<Array<Snapshot>> {
    if (volumeId) {
      return super.getList({ volumeId: volumeId });
    }
    return super.getList();
  }
}
