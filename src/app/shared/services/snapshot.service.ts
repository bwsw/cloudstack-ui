import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BackendResource } from '../decorators/backend-resource.decorator';
import { AsyncJob } from '../models/async-job.model';
import { DESCRIPTION_TAG, Snapshot } from '../models/snapshot.model';
import { AsyncJobService } from './async-job.service';
import { BaseBackendCachedService } from './base-backend-cached.service';
import { TagService } from './tags/tag.service';


@Injectable()
@BackendResource({
  entity: 'Snapshot',
  entityModel: Snapshot
})
export class SnapshotService extends BaseBackendCachedService<Snapshot> {
  constructor(
    private asyncJobService: AsyncJobService,
    private tagService: TagService
  ) {
    super();
  }

  public create(
    volumeId: string,
    name?: string,
    description?: string
  ): Observable<AsyncJob<Snapshot>> {
    this.invalidateCache();
    let params = {};

    if (name) {
      params = { volumeId: volumeId, name };
    } else {
      params = { volumeId: volumeId };
    }

    return this.sendCommand('create', params)
      .switchMap(job => {
        const asyncJob = this.asyncJobService.queryJob(job, this.entity, this.entityModel);
        const tag = description
          ? this.tagService.update({ id: job.id }, this.entity, DESCRIPTION_TAG, description)
          : Observable.of(null);

        return tag.switchMapTo(asyncJob);
      });
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
