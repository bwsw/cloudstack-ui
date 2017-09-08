import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BackendResource } from '../decorators/backend-resource.decorator';
import { Snapshot } from '../models/snapshot.model';
import { AsyncJobService } from './async-job.service';
import { BaseBackendCachedService } from './base-backend-cached.service';
import { SnapshotTagService } from './tags/snapshot/snapshot-tag.service';
import { Subject } from 'rxjs/Subject';


@Injectable()
@BackendResource({
  entity: 'Snapshot',
  entityModel: Snapshot
})
export class SnapshotService extends BaseBackendCachedService<Snapshot> {
  public onSnapshotDeleted = new Subject<Snapshot>();

  constructor(
    private asyncJobService: AsyncJobService,
    private snapshotTagService: SnapshotTagService
  ) {
    super();
  }

  public create(volumeId: string, name?: string, description?: string): Observable<Snapshot> {
    this.invalidateCache();

    const params = this.getSnapshotCreationParams(volumeId, name);
    return this.sendCommand('create', params)
      .switchMap(job => this.asyncJobService.queryJob(job, this.entity, this.entityModel))
      .switchMap(snapshot => {
        if (description) {
          return this.snapshotTagService.setDescription(snapshot, description);
        }

        return Observable.of(snapshot);
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

  private getSnapshotCreationParams(volumeId: string, name?: string): any {
    if (name) {
      return {
        volumeId: volumeId,
        name
      };
    }

    return {
      volumeId
    };
  }
}
