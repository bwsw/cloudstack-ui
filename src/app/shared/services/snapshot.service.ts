import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { BackendResource } from '../decorators';
import { AsyncJob, Snapshot } from '../models';
import { AsyncJobService } from './async-job.service';
import { BaseBackendCachedService } from './base-backend-cached.service';
import { CSCommands } from './base-backend.service';
import { SnapshotTagService } from './tags/snapshot-tag.service';

@Injectable()
@BackendResource({
  entity: 'Snapshot',
})
export class SnapshotService extends BaseBackendCachedService<Snapshot> {
  constructor(
    private asyncJobService: AsyncJobService,
    private snapshotTagService: SnapshotTagService,
    protected http: HttpClient,
  ) {
    super(http);
  }

  public create(volumeId: string, name?: string, description?: string): Observable<Snapshot> {
    this.invalidateCache();

    const params = this.getSnapshotCreationParams(volumeId, name);
    return this.sendCommand(CSCommands.Create, params).pipe(
      switchMap(job => this.asyncJobService.queryJob(job, this.entity)),
      switchMap(snapshot => {
        if (description) {
          return this.snapshotTagService.setDescription(snapshot, description);
        }

        return of(snapshot);
      }),
    );
  }

  public markForRemoval(snapshot: Snapshot): Observable<Snapshot> {
    return this.snapshotTagService.markForRemoval(snapshot);
  }

  public remove(id: string): Observable<any> {
    this.invalidateCache();
    return this.sendCommand(CSCommands.Delete, { id }).pipe(
      switchMap(job => this.asyncJobService.queryJob(job.jobid, this.entity)),
    );
  }

  public revert(id: string): Observable<AsyncJob<Snapshot>> {
    return this.sendCommand(CSCommands.Revert, { id }).pipe(
      switchMap(job => this.asyncJobService.queryJob(job.jobid, this.entity)),
    );
  }

  public getList(volumeId?: string): Observable<Snapshot[]> {
    if (volumeId) {
      return super.getList({ volumeId });
    }
    return super.getList();
  }

  private getSnapshotCreationParams(volumeId: string, name?: string): any {
    if (name) {
      return {
        volumeId,
        name,
      };
    }

    return {
      volumeId,
    };
  }
}
